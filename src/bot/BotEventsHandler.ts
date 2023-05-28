import { container, singleton } from "tsyringe";
import { LogColor, Logger } from "../logger/Logger";
import { BotEvents } from "./BotEvents";
import { User } from "./User";
import { Visitor } from "./Visitor";
import { DOMCoordinateQueue } from "./DOMCoordinateQueue";
import { BotSettingsManager } from "./settings/BotSettingsManager";

@singleton()
export class BotEventsHandler {
    private currentEvent: BotEvents;
    private foundVisitor: boolean = false;

    private visitorsList: Visitor[] = [];
    
    private user: User;
    private logger: Logger;
    private domCoordinateQueue: DOMCoordinateQueue;
    private botSettingsManager: BotSettingsManager;

    constructor() {
        this.domCoordinateQueue = container.resolve(DOMCoordinateQueue);
        this.user = container.resolve(User);
        this.logger = container.resolve(Logger);
        this.botSettingsManager = container.resolve(BotSettingsManager);

        this.currentEvent = BotEvents.NONE;
        this.initializeEventListener();
        this.initializeByPassIsTrusted();
    }

    private initializeByPassIsTrusted(): void {

        if(!(Element.prototype as any)._addEventListener) {
            this.logger.debug(`Initializing ByPassIsTrusted...`);
    
            (Element.prototype as any)._addEventListener = window.Element.prototype.addEventListener;
            Element.prototype.addEventListener = function () {
                let args = [...arguments];
                let temp = args[1];
                args[1] = function () {
                    let args2 = [...arguments];
                    args2[0] = Object.assign({}, args2[0]);
                    args2[0].isTrusted = true;
                    return temp(...args2);
                }
                return (this as any)._addEventListener(...args);
            }
            this.logger.debug(`ByPassIsTrusted Initialized`, LogColor.SUCCESS);
        }
        else {
            this.logger.debug(`ByPassIsTrusted ALREADY Initialized`, LogColor.WARNING);
        }
    }

    private printSingleRobberyResult(robResponse: any) {
        if(robResponse.messages[0] && robResponse.messages[0][0]) {
            let message = "\n" + robResponse.messages[0][0].split('<br />').join('\n');
            this.logger.info(message, LogColor.SUCCESS);
        }
    }

    private printVisitors(visitorsList: Visitor[]): void {
        for(const visitor of visitorsList) {
           let visitorInfo = `\n`;
           visitorInfo += `Username: ${visitor.username}\n`;
           visitorInfo += `Respect: ${visitor.respect}\n`;
           visitorInfo += `Level: ${visitor.level_text_name}\n`;
           visitorInfo += `Character: ${visitor.character_text_name}`;
           this.logger.info(visitorInfo, LogColor.WARNING);
        }
    }

    private initializeEventListener(): void {

        const self = this;

        window.addEventListener(BotEvents.NIGHTCLUBS_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.NIGHTCLUBS_DONE;
            self.user.updateStats(data.detail);
        }, false);

        window.addEventListener(BotEvents.ENTER_NIGHTCLUB_DONE, (data: CustomEventInit<any>)=>{
            this.foundVisitor = false;
            this.visitorsList = [];
            // console.log(data.detail);
            self.currentEvent = BotEvents.ENTER_NIGHTCLUB_DONE;

            if(data.detail?.nightclub.visitors.length > 0) {
                this.foundVisitor = true;
                this.visitorsList = data.detail?.nightclub.visitors;

                this.printVisitors(data.detail?.nightclub.visitors);
            }

            self.user.updateStats(data.detail);
            
        }, false);

        window.addEventListener(BotEvents.EXIT_NIGHTCLUB_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.EXIT_NIGHTCLUB_DONE;
            self.user.updateStats(data.detail);
        }, false);

        window.addEventListener(BotEvents.BUY_DRUG_OR_HOOKER_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.BUY_DRUG_OR_HOOKER_DONE;
            self.user.updateStats(data.detail);
        }, false);

        window.addEventListener(BotEvents.ROBBERIES_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.ROBBERIES_DONE;
        }, false);

        window.addEventListener(BotEvents.ROB_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.ROB_DONE;
            self.user.updateStats(data.detail);
            self.printSingleRobberyResult(data.detail);
        }, false);

        window.addEventListener(BotEvents.ACCEPT_GANG_ROBBERY_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.ACCEPT_GANG_ROBBERY_DONE;
            self.user.updateStats(data.detail);

        }, false);

        window.addEventListener(BotEvents.EXECUTE_GANG_ROBBERY_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.EXECUTE_GANG_ROBBERY_DONE;
            self.user.updateStats(data.detail);

        }, false);

        window.addEventListener(BotEvents.HOOKERS_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.HOOKERS_DONE;
            self.user.updateStats(data.detail);

        }, false);

        window.addEventListener(BotEvents.HOSPITAL_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.HOSPITAL_DONE;
            self.user.updateStats(data.detail);

        }, false);

        window.addEventListener(BotEvents.DETOX_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            self.currentEvent = BotEvents.DETOX_DONE;
            self.user.updateStats(data.detail);

        }, false);

        window.addEventListener(BotEvents.VISITORS_DONE, (data: CustomEventInit<any>)=>{
            // console.log(data.detail);
            this.foundVisitor = true;
            this.visitorsList = data.detail;
            this.printVisitors(data.detail);
            self.currentEvent = BotEvents.VISITORS_DONE;
            // self.user.updateStats(data.detail);

        }, false);

        window.addEventListener('keydown', (event) => {

            const keyboardKeyForPauseResumeBot = 
                self.botSettingsManager
                    .getBotSettings()
                    .general
                    .pauseResume
                    .keyboardKeyForPauseResumeBot
                    .toLowerCase();

            const ctrlOrMetaKeyNecessary = 
                self.botSettingsManager
                    .getBotSettings()
                    .general
                    .pauseResume
                    .ctrlOrMetaKeyNecessary;

            const altKeyNecessary = 
                self.botSettingsManager
                    .getBotSettings()
                    .general
                    .pauseResume
                    .altKeyNecessary;

            const toggleStartStopKey = event.key === keyboardKeyForPauseResumeBot;
            const ctrlOrMetaPressed = event.ctrlKey || event.metaKey;
            const altPressed = event.altKey;

            if(ctrlOrMetaKeyNecessary && altKeyNecessary) {
                if(ctrlOrMetaPressed && altPressed && toggleStartStopKey) {
                    self.domCoordinateQueue.setIsBlocked(
                        !self.domCoordinateQueue.getIsBlocked()
                    );
                }
            }
            else if(ctrlOrMetaKeyNecessary) {
                if(ctrlOrMetaPressed && toggleStartStopKey) {
                    self.domCoordinateQueue.setIsBlocked(
                        !self.domCoordinateQueue.getIsBlocked()
                    );
                }
            }
            else if(altKeyNecessary) {
                if(altPressed && toggleStartStopKey) {
                    self.domCoordinateQueue.setIsBlocked(
                        !self.domCoordinateQueue.getIsBlocked()
                    );
                }
            }
            else {
                if(toggleStartStopKey) {
                    self.domCoordinateQueue.setIsBlocked(
                        !self.domCoordinateQueue.getIsBlocked()
                    );
                }
            }

        }, false);
    }

    public getCurrentEvent(): BotEvents {
        return this.currentEvent;
    }

    public setCurrentEvent(newCurrentEvent: BotEvents): void {
        this.currentEvent = newCurrentEvent;
    }

    public getFoundVisitor(): boolean {
        return this.foundVisitor;
    }

    public setVisitorsList(newVisitorsList: Visitor[]) {
        this.visitorsList = newVisitorsList;
    }

    public getVisitorsList() {
        return this.visitorsList;
    }
}