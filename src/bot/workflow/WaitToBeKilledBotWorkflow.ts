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
import { RandomUtils } from "../../commons/RandomUtils";
import { ProfessionLevelMapping, CharacterSingleAssaultCriteria } from "../settings/BotSettings";

@singleton()
export class WaitToBeKilledBotWorkflow implements IBotWorkflow {

    private updateStatsWorkflow: IBotWorkflow;
    private botEventsHandler: BotEventsHandler;
    private randomUtils: RandomUtils;

    private botDomHelper: BotDOMHelper;
    private waitUtils: WaitUtils;
    private botSettingsManager: BotSettingsManager;
    private logger: Logger;

    constructor() {
        this.updateStatsWorkflow = container.resolve(ForceUpdateStatsBotWorkflow);
        this.botDomHelper = container.resolve(BotDOMHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.botEventsHandler = container.resolve(BotEventsHandler);
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.logger = container.resolve(Logger);
        this.randomUtils = container.resolve(RandomUtils);
    }

    private async clickOnExitButton() {
        this.logger.info(`Clicking on Exit button...`);
        while (this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE) {
            if (this.botDomHelper.getHTMLElementByQuerySelector(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB)) {
                await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.BUTTON_EXIT_NIGHTCLUB);
            }
            else {
                this.botEventsHandler.setCurrentEvent(BotEvents.EXIT_NIGHTCLUB_DONE);
            }
            await this.waitUtils.waitMilliSeconds(200);
        }
    }

    private async clickOnEnterRaveButton() {
        // Not the best solution, but it works
        // This is a workaround for the the crims bug "unknown rave"
        // happening after pressing the enter rave button
        let clickEnterRaveCallback = async () =>{
            this.logger.info(`Clicking on Enter button...`);
            const nextRaveIndex: number = this.randomUtils.intBetween(1, 8);
            await this.botDomHelper.moveToElementByQueryAllIndexSelectorAndClick(DOMElementSelector.BUTTON_ENTER_RAVE, nextRaveIndex);
    
        };
        // Start immediately the check
        clickEnterRaveCallback();
        // Then check every 3 seconds if we are entered in rave or not
        let intervalPid = setInterval(clickEnterRaveCallback, 3000);
        
        await this.waitUtils.waitForLastActionPerformed(BotEvents.ENTER_NIGHTCLUB_DONE);
        // If correctly entered in rave, clear set setInterval
        clearInterval(intervalPid);
    }

    private async waitForVisitors() {

        this.logger.info(`Waiting for visitors...`);
        while (!this.botEventsHandler.getFoundVisitor() 
                && this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE
        ) {
            await this.waitUtils.waitMilliSeconds(100);
        }
    }

    private printCandidateVisitor(candidateVisitor: Visitor) {
        this.logger.info(`Candidate Visitor`, LogColor.WARNING);
        this.logger.info(`Name: ${candidateVisitor.username}`, LogColor.WARNING);
        this.logger.info(`Respect: ${candidateVisitor.respect}`, LogColor.WARNING);
        this.logger.info(`Level: ${candidateVisitor.level_text_name}`, LogColor.WARNING);
        this.logger.info(`Character: ${candidateVisitor.character_text_name}`, LogColor.WARNING);
    }

    private checkIfVisitorIsAllowedToKill(candidateVisitor: Visitor): boolean {
        let isVisitorAllowedToKill: boolean = false;

        const visitorsListAllowedToKill: string[] = 
            this.botSettingsManager.getBotSettings()
                .waitToBeKilled.visitorsListAllowedToKill.map((e) => e.toLowerCase());

        const idVisitorsListAllowedToKill: string[] = 
            this.botSettingsManager.getBotSettings()
                .waitToBeKilled.idVisitorsListAllowedToKill;
        
        this.logger.info(`Visitor username: ${candidateVisitor.username}`, LogColor.WARNING);
        this.logger.info(`Checking if username visitor is in [${visitorsListAllowedToKill}]`, LogColor.WARNING);

        if(visitorsListAllowedToKill.includes(""+candidateVisitor.username?.toLowerCase())) {
            this.logger.info(`Visitor username is in the allowed kill us list`, LogColor.WARNING);
            isVisitorAllowedToKill = true;
        }

        this.logger.info(`Visitor id: ${candidateVisitor.id}`, LogColor.WARNING);
        this.logger.info(`Checking if id visitor is in [${idVisitorsListAllowedToKill}]`, LogColor.WARNING);
        if(idVisitorsListAllowedToKill.includes(""+candidateVisitor.id)) {
            this.logger.info(`Id victim is in the allowed to kill us list`, LogColor.WARNING);
            isVisitorAllowedToKill = true;
        }
        return isVisitorAllowedToKill;
    }

    async execute(): Promise<void> {
        await this.updateStatsWorkflow.execute();

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_NIGHTLIFE);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.NIGHTCLUBS_DONE);

        while(true) {
            await this.clickOnEnterRaveButton();
            await this.waitForVisitors();

            if(this.botEventsHandler.getVisitorsList().length === 1) {

                const candidateVisitor: Visitor = this.botEventsHandler.getVisitorsList()[0];

                this.printCandidateVisitor(candidateVisitor);

                if(this.checkIfVisitorIsAllowedToKill(candidateVisitor)) {
                    this.logger.info(`Found a visitor allowed to kill us!!!`, LogColor.SUCCESS);
                }
                else{
                    this.logger.info(`Candidate visitor NOT ALLOWED to kill us!`, LogColor.WARNING);
                    await this.waitUtils.waitRandomMillisecondsBetween(
                        this.botSettingsManager.getBotSettings()
                            .waitToBeKilled.millisecondsToWaitBeforeExitWhenVisitorComeInsideRave.min,
                        this.botSettingsManager.getBotSettings()
                            .waitToBeKilled.millisecondsToWaitBeforeExitWhenVisitorComeInsideRave.max
                    ); 
                    await this.clickOnExitButton();
                }
            }

            await this.waitUtils.waitRandomMillisecondsBetween(
                this.botSettingsManager.getBotSettings()
                    .waitToBeKilled.millisecondsToWaitAfterExitRave.min,
                this.botSettingsManager.getBotSettings()
                    .waitToBeKilled.millisecondsToWaitAfterExitRave.max
            );
        }
    }
}