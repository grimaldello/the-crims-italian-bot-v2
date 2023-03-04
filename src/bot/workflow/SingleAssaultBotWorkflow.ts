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
import { BotEventsHandler } from "../BotEventsHandler";
import { Visitor } from "../Visitor";
import { MouseSimulator } from "../../mousesimulator/MouseSimulator";
import { DOMCoordinate } from "../../commons/DOMCoordinate";
import { BotSettingsManager } from "../settings/BotSettingsManager";
import { LogColor, Logger } from "../../logger/Logger";

@singleton()
export class SingleAssaultBotWorkflow implements IBotWorkflow {

    private updateStatsWorkflow: IBotWorkflow;
    private detoxWorkflow: IBotWorkflow;
    private rechargeWorkflow: IBotWorkflow;
    private botEventsHandler: BotEventsHandler;
    private mouse: MouseSimulator;

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
        this.botEventsHandler = container.resolve(BotEventsHandler);
        this.mouse = container.resolve(MouseSimulator);
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.logger = container.resolve(Logger);

    }

    public getSingleAssaultStaminaRequired(): number {
        return 50;
    }

    private isVictimKillable(candidateVictim: Visitor): boolean {

        if(candidateVictim === null) {
            this.logger.error("Candidate Victim is null", LogColor.NONE);
            return false;
        }

        let minRespect: number = 
            this.botSettingsManager.getBotSettings().singleAssault.notHitman.minRespect;

        let maxRespect: number = 
            this.botSettingsManager.getBotSettings().singleAssault.notHitman.maxRespect;

        if(candidateVictim.character_text_name?.toUpperCase().includes(`HITMAN`)) {
            this.logger.info(`Victim is a HITMAN`, LogColor.WARNING);
            minRespect = this.botSettingsManager.getBotSettings().singleAssault.hitman.minRespect;
            maxRespect = this.botSettingsManager.getBotSettings().singleAssault.hitman.maxRespect;
        }
        else {
            this.logger.info(`Victim is not a HITMAN`, LogColor.WARNING);
        }

        let isVictimKillable: boolean = false;
        if(candidateVictim.respect) {
            isVictimKillable = candidateVictim.respect > minRespect && 
            candidateVictim.respect <= maxRespect;
        }

        return isVictimKillable;
    }

    async execute(): Promise<void> {
        await this.updateStatsWorkflow.execute();

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_NIGHTLIFE);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.NIGHTCLUBS_DONE);

        while(true) {
            if(this.user.stamina >= this.getSingleAssaultStaminaRequired()) {

                this.logger.info(`Clicking on Enter button...`);
                await this.botDomHelper.moveToElementByQueryAllIndexSelectorAndClick(DOMElementSelector.BUTTON_ENTER_RAVE, 1);
                await this.waitUtils.waitForLastActionPerformed(BotEvents.ENTER_NIGHTCLUB_DONE);

                // Force exit afte some amount of seconds
                let forceExitAfterTime: boolean = false;
                let forceExitAfterMillis: number = 
                    this.botSettingsManager.getBotSettings().singleAssault.forceExitAfterMillis;

                setTimeout(()=>{
                    this.logger.info("Force exit");
                    forceExitAfterTime = true;
                }, forceExitAfterMillis);

                this.logger.info(`Waiting for victims...`);
                while(!this.botEventsHandler.getFoundVisitor() && 
                        this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE &&
                        !forceExitAfterTime) {
                    await this.waitUtils.waitMilliSeconds(100);
                }

                if(this.botEventsHandler.getVisitorsList().length === 1) {
                    const candidateVictim: Visitor = this.botEventsHandler.getVisitorsList()[0];

                    this.logger.info(`Candidate Victim`, LogColor.WARNING);
                    this.logger.info(`Name: ${candidateVictim.username}`, LogColor.WARNING);
                    this.logger.info(`Respect: ${candidateVictim.respect}`, LogColor.WARNING);
                    this.logger.info(`Level: ${candidateVictim.level_text_name}`, LogColor.WARNING);
                    this.logger.info(`Character: ${candidateVictim.character_text_name}`, LogColor.WARNING);

                    if(this.isVictimKillable(candidateVictim)) {
                            
                        this.logger.info(`All victim criteria are matched for assult.`, LogColor.SUCCESS);
                        this.logger.info(`ASSAULT!!`, LogColor.SUCCESS);
                        // Open Assault drop down menu
                        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.ASSAULT_DROPDOWN_MENU);
                        await this.waitUtils.waitMilliSeconds(10);

                        // Select Single Assault item
                        let currentPosition: DOMCoordinate = this.mouse.getFakeCursorDOMCoordinate();
                        await this.botDomHelper.moveFromCurrentCoordinateToAnotherCoordinateAndClick({
                            x: currentPosition.x,
                            y: currentPosition.y + 60
                        });
                        await this.waitUtils.waitMilliSeconds(10);

                        // Click Assault button
                        currentPosition = this.mouse.getFakeCursorDOMCoordinate();
                        await this.botDomHelper.moveFromCurrentCoordinateToAnotherCoordinateAndClick({
                            x: currentPosition.x,
                            y: currentPosition.y -30
                        });

                        await this.waitUtils.waitMilliSeconds(6000);

                    }
                    else{
                        this.logger.info(`Candidate victim TOO STRONG!`, LogColor.WARNING);
                    }
                }

                this.logger.info(`Clicking on Exit button...`);
                while(this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE) {
                    if(this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB)) {
                        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB);
                    }
                    else {
                        this.botEventsHandler.setCurrentEvent(BotEvents.EXIT_NIGHTCLUB_DONE);
                    }
                    await this.waitUtils.waitMilliSeconds(200);
                }

                await this.waitUtils.waitMilliSeconds(5000);
                await this.botDomHelper.moveFromCurrentCoordinateToRandomCoordinate();

            }
            else {
                if(this.user.addiction >= this.botSettingsManager.getBotSettings().detox.threshold) {
                    await this.detoxWorkflow.execute();
                }
                await this.rechargeWorkflow.execute();
                // await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_NIGHTLIFE);
                // await this.waitUtils.waitForLastActionPerformed(BotEvents.NIGHTCLUBS_DONE);

            }
            
        }
    }
    
}