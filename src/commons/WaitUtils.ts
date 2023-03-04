import { container, singleton } from "tsyringe";
import { BotEvents } from "../bot/BotEvents";
import { BotEventsHandler } from "../bot/BotEventsHandler";
import { Logger } from "../logger/Logger";

@singleton()
export class WaitUtils {

    private botEventsHandler: BotEventsHandler;
    private logger: Logger;

    constructor() {
        this.botEventsHandler = container.resolve(BotEventsHandler);
        this.logger = container.resolve(Logger);
    }

    public async waitMilliSeconds(milliSecondsToWait: number) {
        return await new Promise( resolve => setTimeout(resolve, milliSecondsToWait));
    }

    public async waitForLastActionPerformed(botEventToWait: BotEvents) {

        while(this.botEventsHandler.getCurrentEvent() !== botEventToWait) {
            // this.logger.debug(`Waiting for: ${botEventToWait}`);
            // this.logger.debug(`Current event is: ${this.botEventsHandler.getCurrentEvent()}`);
            await this.waitMilliSeconds(100);
        }
        
    }
}