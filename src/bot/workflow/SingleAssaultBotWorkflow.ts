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
export class SingleAssaultBotWorkflow implements IBotWorkflow {

    private updateStatsWorkflow: IBotWorkflow;
    private detoxWorkflow: IBotWorkflow;
    private rechargeWorkflow: IBotWorkflow;
    private botEventsHandler: BotEventsHandler;
    private mouse: MouseSimulator;
    private randomUtils: RandomUtils;

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
        this.randomUtils = container.resolve(RandomUtils);

    }

    public getSingleAssaultStaminaRequired(): number {
        return 50;
    }

    private getRandomDetox(): number {
        return this.randomUtils.intBetween(
            this.botSettingsManager.getBotSettings().detox.threshold.min,
            this.botSettingsManager.getBotSettings().detox.threshold.max
        );
    }

    private checkIfVictimInRaveIsToAvoidToKill(candidateVictim: Visitor): boolean {
        let avoidToKill: boolean = false;

        const usernameVictimToAvoidToKillList: string[] = 
            this.botSettingsManager.getBotSettings()
                .singleAssault.victimUsernameToAvoidToKillList.map((e) => e.toLowerCase());

        const idsVictimToAvoidToKillList: string[] = 
            this.botSettingsManager.getBotSettings()
                .singleAssault.victimIdsToAvoidToKillList;
        
        this.logger.info(`Victim username: ${candidateVictim.username}`, LogColor.WARNING);
        this.logger.info(`Checking if username victim is in [${usernameVictimToAvoidToKillList}]`, LogColor.WARNING);

        if(usernameVictimToAvoidToKillList.includes(""+candidateVictim.username?.toLowerCase())) {
            this.logger.info(`Victim username is in the avoid to kill list`, LogColor.WARNING);
            avoidToKill = true;
        }

        this.logger.info(`Victim id: ${candidateVictim.id}`, LogColor.WARNING);
        this.logger.info(`Checking if id victim is in [${idsVictimToAvoidToKillList}]`, LogColor.WARNING);
        if(idsVictimToAvoidToKillList.includes(""+candidateVictim.id)) {
            this.logger.info(`Id victim is in the avoid to kill list`, LogColor.WARNING);
            avoidToKill = true;
        }
        return avoidToKill;
    }

    private checkIfVictimMatchKillCriteria(candidateVictim: Visitor): boolean {

        if(candidateVictim === null) {
            this.logger.error("Candidate Victim is null", LogColor.NONE);
            return false;
        }

        const candidateVictimLevelTextName: string = candidateVictim.level_text_name as string;
        const candidateVictimLevelNumber: number = 
            ProfessionLevelMapping.getLevelByLevelTextName(candidateVictimLevelTextName);

        this.logger.info(`Victim level is: ${candidateVictimLevelTextName} (${candidateVictimLevelNumber})`, LogColor.WARNING);
        
        const singleAssaultCriteria: any = 
            this.botSettingsManager.getBotSettings().singleAssault.criteriaAssault;

        const candidateVictimProfession: string = candidateVictim.character_text_name as string;
        const victimAssaultCriteria: CharacterSingleAssaultCriteria = 
            singleAssaultCriteria[candidateVictimProfession] as CharacterSingleAssaultCriteria;
        
        this.logger.info(`Assault criteria configured for profession ${candidateVictimProfession} is:`, LogColor.WARNING);
        this.logger.info(`Max level: : ${victimAssaultCriteria.maxLevel}`, LogColor.WARNING);
        this.logger.info(`Min respect: : ${victimAssaultCriteria.minRespect}`, LogColor.WARNING);
        this.logger.info(`Max respect: : ${victimAssaultCriteria.maxRespect}`, LogColor.WARNING);

        const victimRespect: number = candidateVictim.respect as number;

        let isMatchedRespectCriteria: boolean = false;
        let isMatchedLevelCriteria: boolean = false;

        if(victimRespect <= victimAssaultCriteria.maxRespect
            && victimRespect >= victimAssaultCriteria.minRespect
        ){
            this.logger.info(`Matched respect criteria`, LogColor.SUCCESS);
            isMatchedRespectCriteria = true;
        }
        else {
            this.logger.info(`NOT Matched respect criteria`, LogColor.WARNING);
        }

        if(candidateVictimLevelNumber <= victimAssaultCriteria.maxLevel) {
            this.logger.info(`Matched level criteria`, LogColor.SUCCESS );
            isMatchedLevelCriteria = true;
        }
        else {
            this.logger.info(`NOT Matched level criteria`, LogColor.WARNING);
        }

        return isMatchedRespectCriteria && isMatchedLevelCriteria;
    }

    private printCandidateVictimInfo(candidateVictim: Visitor) {
        this.logger.info(`Candidate Victim`, LogColor.WARNING);
        this.logger.info(`Name: ${candidateVictim.username}`, LogColor.WARNING);
        this.logger.info(`Respect: ${candidateVictim.respect}`, LogColor.WARNING);
        this.logger.info(`Level: ${candidateVictim.level_text_name}`, LogColor.WARNING);
        this.logger.info(`Character: ${candidateVictim.character_text_name}`, LogColor.WARNING);
    }

    private async waitForVictim() {
        // Force exit after some amount of seconds
        let forceExitAfterTime: boolean = false;
        let forceExitAfterMillis: number = this.botSettingsManager.getBotSettings().singleAssault.forceExitAfterMillis;

        setTimeout(() => {
            this.logger.info("Force exit");
            forceExitAfterTime = true;
        }, forceExitAfterMillis);

        this.logger.info(`Waiting for victims...`);
        while (!this.botEventsHandler.getFoundVisitor() &&
            this.botEventsHandler.getCurrentEvent() !== BotEvents.EXIT_NIGHTCLUB_DONE &&
            !forceExitAfterTime) {
            await this.waitUtils.waitMilliSeconds(100);
        }
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

    private async attack() {
        this.logger.info(`All victim criteria are matched for assault.`, LogColor.SUCCESS);
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
            y: currentPosition.y - 30
        });

        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .singleAssault.millisecondsToWaitAfterAssault.min,
            this.botSettingsManager.getBotSettings()
                .singleAssault.millisecondsToWaitAfterAssault.max
        );
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

    private async waitAfterAssault() {
        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .singleAssault.millisecondsToWaitAfterExitRave.min,
            this.botSettingsManager.getBotSettings()
                .singleAssault.millisecondsToWaitAfterExitRave.max
        );
    }

    private async waitAfterPerformedAssault() {
        await this.waitUtils.waitRandomMillisecondsBetween(
            this.botSettingsManager.getBotSettings()
                .singleAssault.millisecondsToWaitAfterExitRaveIfPerformedAssault.min,
            this.botSettingsManager.getBotSettings()
                .singleAssault.millisecondsToWaitAfterExitRaveIfPerformedAssault.max
        );
    }

    async execute(): Promise<void> {
        await this.updateStatsWorkflow.execute();

        await this.botDomHelper.moveToElementByQuerySelectorAndClick(DOMElementSelector.MENU_NIGHTLIFE);
        await this.waitUtils.waitForLastActionPerformed(BotEvents.NIGHTCLUBS_DONE);

        let performedAssault: boolean = false;

        while(true) {
            if(this.user.stamina >= this.getSingleAssaultStaminaRequired()) {

                await this.clickOnEnterRaveButton();
                await this.waitForVictim();

                if(this.botEventsHandler.getVisitorsList().length === 1) {
                    const candidateVictim: Visitor = this.botEventsHandler.getVisitorsList()[0];

                    this.printCandidateVictimInfo(candidateVictim);

                    if(this.checkIfVictimInRaveIsToAvoidToKill(candidateVictim)) {
                        this.logger.info(`Found a victim to avoid!!!. Exiting...`);
                    }
                    else if(this.checkIfVictimMatchKillCriteria(candidateVictim)) {
                        performedAssault = true;
                        await this.attack();
                    }
                    else{
                        this.logger.info(`Candidate victim NOT MATCH CRITERIA!`, LogColor.WARNING);
                    }
                }
                await this.clickOnExitButton();
                await this.waitDependingIfAssaultHasBeenPerformed(performedAssault);
                await this.botDomHelper.moveFromCurrentCoordinateToRandomCoordinate();

            }
            else {
                if(this.user.addiction >= this.getRandomDetox()) {
                    await this.detoxWorkflow.execute();
                }
                await this.rechargeWorkflow.execute();

            }
        }
    }

    private async waitDependingIfAssaultHasBeenPerformed(performedAssault: boolean) {
        if (performedAssault) {
            this.logger.info(`Waiting after assault`);
            await this.waitAfterPerformedAssault();
        }
        else {
            this.logger.info(`Waiting after NO assault`);
            await this.waitAfterAssault();
        }
    }
}