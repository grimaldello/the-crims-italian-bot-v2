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
import { RandomUtils } from "../../commons/RandomUtils";
import { IDetoxCalculatorStrategy } from "../detox/IDetoxCalculatorStrategy";
import { RandomDetoxCalculatorStrategy } from "../detox/RandomDetoxCalculatorStrategy";

@singleton()
export class GangRobberyBotWorkflow implements IBotWorkflow {
    
    private updateStatsWorkflow: IBotWorkflow;
    private detoxWorkflow: IBotWorkflow;
    private rechargeWorkflow: IBotWorkflow;

    private botDomHelper: BotDOMHelper;
    private waitUtils: WaitUtils;
    private user: User;
    private botSettingsManager: BotSettingsManager;
    private randomUtils: RandomUtils;

    private logger: Logger;
    private detoxCalculatorStrategy: IDetoxCalculatorStrategy;

    constructor() {
        this.updateStatsWorkflow = container.resolve(ForceUpdateStatsBotWorkflow);
        this.detoxWorkflow = container.resolve(DetoxBotWorkflow);
        this.rechargeWorkflow = container.resolve(RechargeBotWorkflow);
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.user = container.resolve(User);
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.logger = container.resolve(Logger);
        this.randomUtils = container.resolve(RandomUtils);
        this.detoxCalculatorStrategy = container.resolve(RandomDetoxCalculatorStrategy);
    }

    public getPlannedGangRobberyStaminaRequired(): number {
        const robberiesLocalStorageObject = JSON.parse(localStorage.getItem("vuex") as string).Robberies;

        let energyRequired: number = robberiesLocalStorageObject.plannedRobbery.energy_per_participant;
        
        if(!energyRequired) {
            throw Error("Error while getting energy required for gang robbery");
        }

        return energyRequired;
    }

    private getRandomDetox(): number {
        return this.detoxCalculatorStrategy.getDetoxThresholdValue();
    }

    async execute(): Promise<void> {

        await this.updateStatsWorkflow.execute();

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ROBBERY);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.ROBBERIES_DONE);

        while(true) {
            this.logger.info(`Executing Gang Robbery`);
            if(this.user.stamina >= this.getPlannedGangRobberyStaminaRequired()) {
                
                await this.tryClickOnAcceptButton();
        
                await this.tryToClickOnDoTheScoreButton();

                await this.waitForOtherToAccept();
                
                if(this.botSettingsManager.getBotSettings().gangRobbery.makeRandomMovement) {
                    await this.botDomHelper.moveFromCurrentCoordinateToRandomCoordinate();
                }

            }
            else {

                if(this.user.addiction >= this.getRandomDetox()) {
                    await this.detoxWorkflow.execute();
                }
                await this.rechargeWorkflow.execute();
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ROBBERY);
                await this.waitUtils.waitForLastActionPerformed(BotEvents.ROBBERIES_DONE);
            }
        }
    }

    private async waitForOtherToAccept() {
        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .gangRobbery.millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore.min,
            this.botSettingsManager.getBotSettings()
                .gangRobbery.millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore.max
        );
    }

    private async tryToClickOnDoTheScoreButton() {
        const isClickOnDoTheScoreEnabled: boolean = 
            this.botSettingsManager.getBotSettings().gangRobbery.clickOnDoTheScoreButton;

        if(isClickOnDoTheScoreEnabled) {
            const executeGangRobberyButton: HTMLElement | null = this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_GANG_ROBBERY_EXECUTE);

            if (executeGangRobberyButton !== null) {
    
                const isVisibleExecuteGangRobberyButton: boolean = !(executeGangRobberyButton.style.display === "none");
    
                if (isVisibleExecuteGangRobberyButton) {
                    this.logger.info(`Clicking Execute button...`, LogColor.SUCCESS);
                    await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_GANG_ROBBERY_EXECUTE);
                }
            }
        }
        else {
            this.logger.info(`Click on "Do the Score!" button is not enabled`);
        }

    }

    private async tryClickOnAcceptButton() {
        const acceptGangRobberyButton: HTMLElement | null = this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_GANG_ROBBERY_ACCEPT);

        if (acceptGangRobberyButton !== null) {
            const isVisibleAcceptGangRobberyButton: boolean = !(acceptGangRobberyButton.style.display === "none");

            if (isVisibleAcceptGangRobberyButton) {
                this.logger.info(`Clicking Accept button...`, LogColor.SUCCESS);
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_GANG_ROBBERY_ACCEPT);
            }
        }
    }
}