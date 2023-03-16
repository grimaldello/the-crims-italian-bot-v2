import { container, singleton } from "tsyringe";
import { BotEvents } from "../bot/BotEvents";
import { BotEventsHandler } from "../bot/BotEventsHandler";
import { BotSettingsManager } from "../bot/settings/BotSettingsManager";
import { Logger } from "../logger/Logger";
import { RandomUtils } from "./RandomUtils";

@singleton()
export class WaitUtils {

    private botEventsHandler: BotEventsHandler;
    private logger: Logger;
    private botSettingsManager: BotSettingsManager;
    private randomUtils: RandomUtils;

    constructor() {
        this.botEventsHandler = container.resolve(BotEventsHandler);
        this.logger = container.resolve(Logger);
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.randomUtils = container.resolve(RandomUtils);
    }

    public async waitMilliSeconds(milliSecondsToWait: number) {
        return await new Promise( resolve => setTimeout(resolve, milliSecondsToWait));
    }

    public async waitRandomMillisecondsBetween(minMilliseconds: number, maxMilliseconds: number) {
        const randomMillisecondsToWait: number = 
            this.randomUtils.intBetween(minMilliseconds, maxMilliseconds);
        return await new Promise( resolve => setTimeout(resolve, randomMillisecondsToWait));
    }

    public async waitForLastActionPerformed(botEventToWait: BotEvents) {

        while(this.botEventsHandler.getCurrentEvent() !== botEventToWait) {
            // this.logger.debug(`Waiting for: ${botEventToWait}`);
            // this.logger.debug(`Current event is: ${this.botEventsHandler.getCurrentEvent()}`);
            await this.waitMilliSeconds(100);
        }
        
    }
}