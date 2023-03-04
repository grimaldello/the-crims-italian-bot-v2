import { container, singleton } from "tsyringe";
import { WaitUtils } from "../../commons/WaitUtils";
import { BotDOMHelper } from "../BotDOMHelper";
import { BotEvents } from "../BotEvents";
import { DOMElementSelector } from "../DOMElementsSelector";
import { User } from "../User";
import { DetoxBotWorkflow } from "./commons/DetoxBotWorkflow";
import { IBotWorkflow } from "./commons/IBotWorkflow";
import { RechargeBotWorkflow } from "./commons/RechargeBotWorkflow";
import { ForceUpdateStatsBotWorkflow } from "./commons/ForceUpdateStatsBotWorkflow";
import { BotSettingsManager } from "../settings/BotSettingsManager";
import { LogColor, Logger } from "../../logger/Logger";

@singleton()
export class GangRobberyBotWorkflow implements IBotWorkflow {
    
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

    public getPlannedGangRobberyStaminaRequired(): number {
        const robberiesLocalStorageObject = JSON.parse(localStorage.getItem("vuex") as string).Robberies;

        let energyRequired: number = robberiesLocalStorageObject.plannedRobbery.energy_per_participant;
        
        if(!energyRequired) {
            throw Error("Error while getting energy required for gang robbery");
        }

        return energyRequired;
    }

    async execute(): Promise<void> {

        await this.updateStatsWorkflow.execute();

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ROBBERY);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.ROBBERIES_DONE);

        while(true) {
            this.logger.info(`Executing Gang Robbery`);
            if(this.user.stamina >= this.getPlannedGangRobberyStaminaRequired()) {
                const acceptGangRobberyButton: HTMLElement | null = 
                    this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_GANG_ROBBERY_ACCEPT);
        
                if(acceptGangRobberyButton !== null) {
                    const isVisibleAcceptGangRobberyButton: boolean = 
                        !(acceptGangRobberyButton.style.display === "none");
        
                    if(isVisibleAcceptGangRobberyButton) {
                        this.logger.info(`Clicking Accept button...`, LogColor.SUCCESS);
                        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_GANG_ROBBERY_ACCEPT);
                    }
                }
        
                const executeGangRobberyButton: HTMLElement | null = 
                    this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_GANG_ROBBERY_EXECUTE);

                if(executeGangRobberyButton !== null) {

                    const isVisibleExecuteGangRobberyButton: boolean = 
                        !(executeGangRobberyButton.style.display === "none");
        
                    if(isVisibleExecuteGangRobberyButton) {
                        this.logger.info(`Clicking Execute button...`, LogColor.SUCCESS);
                        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_GANG_ROBBERY_EXECUTE);
                    }
                }

                await this.waitUtils.waitMilliSeconds(500);
                await this.botDomHelper.moveFromCurrentCoordinateToRandomCoordinate();

            }
            else {
                if(this.user.addiction >= this.botSettingsManager.getBotSettings().detox.threshold) {
                    await this.detoxWorkflow.execute();
                }
                await this.rechargeWorkflow.execute();
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ROBBERY);
                await this.waitUtils.waitForLastActionPerformed(BotEvents.ROBBERIES_DONE);
            }
        }
    }
}