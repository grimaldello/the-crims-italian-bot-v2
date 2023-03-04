import { container, singleton } from "tsyringe";
import { RandomUtils } from "../../../commons/RandomUtils";
import { WaitUtils } from "../../../commons/WaitUtils";
import { LogColor, Logger } from "../../../logger/Logger";
import { BotDOMHelper } from "../../BotDOMHelper";
import { BotEvents } from "../../BotEvents";
import { DOMElementSelector } from "../../DOMElementsSelector";
import { IBotWorkflow } from "./IBotWorkflow";

@singleton()
export class ForceUpdateStatsBotWorkflow implements IBotWorkflow {

    private botDomHelper: BotDOMHelper;
    private waitUtils: WaitUtils;
    private logger: Logger;

    constructor() {
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.logger = container.resolve(Logger);
    }

    async execute(): Promise<void> {
        this.logger.info(`Going to Force Update stats...`);
        this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_HOOKERS);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.HOOKERS_DONE);
        this.logger.info(`Force Update done...`);
    }
    
}