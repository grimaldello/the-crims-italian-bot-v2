import { container, singleton } from "tsyringe";
import { WaitUtils } from "../../../commons/WaitUtils";
import { LogColor, Logger } from "../../../logger/Logger";
import { BotDOMHelper } from "../../BotDOMHelper";
import { BotEvents } from "../../BotEvents";
import { DOMElementSelector } from "../../DOMElementsSelector";
import { IBotWorkflow } from "./IBotWorkflow";

@singleton()
export class DetoxBotWorkflow implements IBotWorkflow {

    private botDomHelper: BotDOMHelper;
    private waitUtils: WaitUtils;
    private logger: Logger;

    constructor() {
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.logger = container.resolve(Logger);
    }

    public async execute(): Promise<void> {
        this.logger.info("Going to Detox...");
        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_HOSPITAL);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.HOSPITAL_DONE);

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_DETOX);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.DETOX_DONE);
        this.logger.info("Detox done");
    }

}