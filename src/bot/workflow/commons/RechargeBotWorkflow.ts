import { container, singleton } from "tsyringe";
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

    constructor() {
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.domCoordinateQueue = container.resolve(DOMCoordinateQueue);
        this.botEventsHandler = container.resolve(BotEventsHandler);
        this.user = container.resolve(User);
        this.logger = container.resolve(Logger);
        this.botSettingsManager = container.resolve(BotSettingsManager);
    }
    
    async execute(): Promise<void> {
        this.logger.info(`Going to Recharge...`);
        
        const ticketsStopLimit: number =
            this.botSettingsManager.getBotSettings().rechargeEnergy.ticketsStopLimit
        if(this.user.tickets === ticketsStopLimit) {
            throw new Error("Tickets limit reached. Bot Will stop.");
        }

        if(this.user.stamina >= 99) {
            this.logger.info("Recharge not necessary", LogColor.WARNING);
            return;
        }

        if(!window.location.href.endsWith("nightlife")) {
            this.logger.info(`Clicking Nightlife menu...`);
            await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_NIGHTLIFE);
            await this.waitUtils.waitForLastActionPerformed(BotEvents.NIGHTCLUBS_DONE);
        }
        else {
            this.logger.info(`Already in nightlife page`);
        }

        this.logger.info(`Clicking Enter button...`);
        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_ENTER_FAVORITE_RAVE);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.ENTER_NIGHTCLUB_DONE);

        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterEnterRave.min,
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterEnterRave.max
        );
        
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

        while(this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE) {
            if(this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB)) {
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
        // await this.waitUtils.waitForLastActionPerformed(BotEvents.EXIT_NIGHTCLUB_DONE);
        this.logger.info(`Recharge Done`);
        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterExitRave.min,
            this.botSettingsManager.getBotSettings()
                .rechargeEnergy.millisecondsToWaitAfterExitRave.max,
        );
    }

}