import { container, singleton } from "tsyringe";
import { WaitUtils } from "../../commons/WaitUtils";
import { BotDOMHelper } from "../BotDOMHelper";
import { BotEvents } from "../BotEvents";
import { DOMElementSelector } from "../DOMElementsSelector";
import { User } from "../User";
import { DetoxBotWorkflow } from "./commons/DetoxBotWorkflow";
import { RechargeBotWorkflow } from "./commons/RechargeBotWorkflow";
import { ForceUpdateStatsBotWorkflow } from "./commons/ForceUpdateStatsBotWorkflow";
import { IBotWorkflow } from "./commons/IBotWorkflow";
import { BotSettingsManager } from "../settings/BotSettingsManager";
import { LogColor, Logger } from "../../logger/Logger";

@singleton()
export class SingleRobberyBotWorkflow implements IBotWorkflow {

    private updateStatsWorkflow: IBotWorkflow;
    private detoxWorkflow: IBotWorkflow;
    private rechargeWorkflow: IBotWorkflow;

    private botDomHelper: BotDOMHelper;
    private waitUtils: WaitUtils;
    private user: User;
    private botSettingsManager: BotSettingsManager;

    private logger: Logger;

    constructor() {
        this.updateStatsWorkflow = container.resolve(ForceUpdateStatsBotWorkflow);
        this.detoxWorkflow = container.resolve(DetoxBotWorkflow);
        this.rechargeWorkflow = container.resolve(RechargeBotWorkflow);
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.user = container.resolve(User);
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.logger = container.resolve(Logger);
    }

    private getSingleRobberyStaminaRequired(): number {
        const robberiesLocalStorageObject = JSON.parse(localStorage.getItem("vuex") as string).Robberies;
        const lastSingleRobberyId: number = robberiesLocalStorageObject.lastSingleRobberyId;
        const singleRobberiesList = robberiesLocalStorageObject.singleRobberies;

        let energyRequired: number | undefined;
        for(const rob of singleRobberiesList) {
            if(rob.id === lastSingleRobberyId) {
                energyRequired = rob.energy;
                break;
            }
        }
        
        if(!energyRequired) {
            throw Error("Error while getting energy required for single robbery");
        }

        return energyRequired;
                
    }

    async execute(): Promise<void> {

        await this.updateStatsWorkflow.execute();

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ROBBERY);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.ROBBERIES_DONE);

        while(true) {
            this.logger.info(`Executing Single Robbery`);

            if(this.user.stamina >= this.getSingleRobberyStaminaRequired()) {

                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_SINGLE_ROBBERY);
                await this.waitUtils.waitForLastActionPerformed(BotEvents.ROB_DONE);
            }
            else {
                if(this.user.addiction >= this.botSettingsManager.getBotSettings().detox.threshold) {
                    await this.detoxWorkflow.execute();
                }
                await this.rechargeWorkflow.execute();
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ROBBERY);
                await this.waitUtils.waitForLastActionPerformed(BotEvents.ROBBERIES_DONE);
                await this.botDomHelper.moveFromCurrentCoordinateToRandomCoordinate();
            }
        }
    }
    
}