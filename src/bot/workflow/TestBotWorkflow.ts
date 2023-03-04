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
import { DOMCoordinate } from "../../commons/DOMCoordinate";

@singleton()
export class TestBotWorkflow implements IBotWorkflow {

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

    async execute(): Promise<void> {


        this.logger.info(`Executing Single Robbery`);

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_SQUARE);
        
        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_ASSAULT);

    }
    
}