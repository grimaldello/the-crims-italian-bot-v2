import { container, singleton } from "tsyringe";
import { RandomUtils } from "../../../commons/RandomUtils";
import { WaitUtils } from "../../../commons/WaitUtils";
import { LogColor, Logger } from "../../../logger/Logger";
import { BotDOMHelper } from "../../BotDOMHelper";
import { BotEvents } from "../../BotEvents";
import { BotEventsHandler } from "../../BotEventsHandler";
import { DOMCoordinateQueue } from "../../DOMCoordinateQueue";
import { DOMElementSelector } from "../../DOMElementsSelector";
import { BotSettingsManager } from "../../settings/BotSettingsManager";
import { User } from "../../User";
import { IBotWorkflow } from "./IBotWorkflow";

@singleton()
export class RechargeBotWorkflow implements IBotWorkflow {

    private botDomHelper: BotDOMHelper;
    private waitUtils: WaitUtils;
    private domCoordinateQueue: DOMCoordinateQueue;
    private botEventsHandler: BotEventsHandler;
    private user: User;
    private logger: Logger;
    private botSettingsManager: BotSettingsManager;
    private randomUtils: RandomUtils;

    constructor() {
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.domCoordinateQueue = container.resolve(DOMCoordinateQueue);
        this.botEventsHandler = container.resolve(BotEventsHandler);
        this.user = container.resolve(User);
        this.logger = container.resolve(Logger);
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.randomUtils = container.resolve(RandomUtils);
    }
    
    async execute(): Promise<void> {
        this.logger.info(`Going to Recharge...`);

        let recharged: boolean = false;

        while(!recharged) {
            
            this.checkIfTicketsLimitIsReached();

            if(this.user.stamina >= 99) {
                this.logger.info("Recharge not necessary", LogColor.WARNING);
                return;
            }

            await this.clickOnNightlifePage();

            await this.clickOnEnterRaveButton();

            await this.waitAfterClickEnterRaveButton();
            
            if(!this.botEventsHandler.getFoundVisitor()) {
                this.logger.info(`Clicking Buy button...`);
                await this.botDomHelper.moveToElementByQuerySelectorInRadius(
                    DOMElementSelector.BUTTON_BUY_DRUG,
                    this.botSettingsManager.getBotSettings().rechargeEnergy.pixelsRadiusOfRandomMovementAroundBuyButton
                );
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_BUY_DRUG);
                while(!this.domCoordinateQueue.isLastCoordinate()) {
                    await this.waitUtils.waitMilliSeconds(200);
                }
                this.botEventsHandler.setCurrentEvent(BotEvents.BUY_DRUG_OR_HOOKER_DONE);
                recharged = true;
            }
            else {
                this.logger.info("FOUND VISITOR! Exiting...", LogColor.WARNING);

                await this.waitUtils.waitRandomMillisecondsBetween(
                    this.botSettingsManager.getBotSettings()
                        .rechargeEnergy.millisecondsToWaitAfterEnterRaveIfVisitorInside.min,
                    this.botSettingsManager.getBotSettings()
                        .rechargeEnergy.millisecondsToWaitAfterEnterRaveIfVisitorInside.max
                );
            }

            await this.clickOnExitRave();
        }
        // await this.waitUtils.waitForLastActionPerformed(BotEvents.EXIT_NIGHTCLUB_DONE);
        this.logger.info(`Recharge Done`);
        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterExitRave.min,
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterExitRave.max,
        );
    }


    private async clickOnExitRave() {
        while (this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE) {
            if (this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB)) {
                this.logger.info(`Clicking to Exit button...`);
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB);
            }
            else {
                this.botEventsHandler.setCurrentEvent(BotEvents.EXIT_NIGHTCLUB_DONE);
            }

            await this.waitUtils.waitRandomMillisecondsBetween(
                this.botSettingsManager.getBotSettings()
                    .rechargeEnergy.millisecondsToWaitAfterClickExitButton.min,
                this.botSettingsManager.getBotSettings()
                    .rechargeEnergy.millisecondsToWaitAfterClickExitButton.max
            );
        }
    }

    private async waitAfterClickEnterRaveButton() {
        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterEnterRave.min,
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterEnterRave.max
        );
    }

    private async clickOnEnterRaveButton() {
        // Not the best solution, but it works
        // This is a workaround for the the crims bug "unknown rave"
        // happening after pressing the enter rave button
        let clickEnterRaveCallback = async () =>{
            this.logger.info(`Clicking Enter button...`);
            const useRandomRaveForRecharge: boolean 
                = this.botSettingsManager.getBotSettings().rechargeEnergy.useRandomRaveForRecharge;
            
            const enterFavoriteRaveButton: HTMLElement | null = 
                this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_ENTER_FAVORITE_RAVE);
    
            if(enterFavoriteRaveButton === null) {
                this.logger.info(`Favorite rave not found. Fallback to random rave`);
            }
    
            if(useRandomRaveForRecharge || enterFavoriteRaveButton === null) {
                this.logger.info(`Entering random rave`);
                const nextRaveIndex: number = this.randomUtils.intBetween(1,8);
                await this.botDomHelper.moveToElementByQueryAllIndexSelectorAndClick(DOMElementSelector.BUTTON_ENTER_RAVE, nextRaveIndex);
    
            }
            else {
                this.logger.info(`Entering favorite rave`);
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_ENTER_FAVORITE_RAVE);
            }
        }
        // To start immediately the check
        clickEnterRaveCallback();
        // Then check every 3 seconds if we are entered in rave or not
        let intervalPid = setInterval(clickEnterRaveCallback, 3000);
        
        await this.waitUtils.waitForLastActionPerformed(BotEvents.ENTER_NIGHTCLUB_DONE);
        // If correctly entered in rave, clear set setInterval
        clearInterval(intervalPid);
        
    }

    private async clickOnNightlifePage() {
        if (!window.location.href.endsWith("nightlife")) {
            this.logger.info(`Clicking Nightlife menu...`);
            await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_NIGHTLIFE);
            await this.waitUtils.waitForLastActionPerformed(BotEvents.NIGHTCLUBS_DONE);
        }
        else {
            this.logger.info(`Already in nightlife page`);
        }
    }

    private checkIfTicketsLimitIsReached() {
        const ticketsStopLimit: number = this.botSettingsManager.getBotSettings().rechargeEnergy.ticketsStopLimit;
        if (this.user.tickets === ticketsStopLimit) {
            throw new Error("Tickets limit reached. Bot Will stop.");
        }
    }
}