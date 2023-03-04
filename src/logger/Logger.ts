import { container, singleton } from "tsyringe";
import { BotSettingsManager } from "../bot/settings/BotSettingsManager";

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    ERROR = 2,
    NONE = 9999
}

export enum LogColor {
    NONE = '',
    NORMAL = 'font-weight: bold;',
    SUCCESS = 'font-weight: bold; background: #03fc28; color: #000000',
    WARNING = 'font-weight: bold; background: #ffff00; color: red',
}

@singleton()
export class Logger {
    private level: LogLevel;
    private botSettingsManager: BotSettingsManager;

    private getTimeStamp(): string {
        const now = new Date();
        return `${now.toLocaleString()} ${now.getMilliseconds()}`;
    }

    constructor() {
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.level = this.botSettingsManager.getBotSettings().logger.level;

        // (function(document, tag) {
        //     const scriptTag = document.createElement(tag);
        //     const firstScriptTag = (document.getElementsByTagName(tag)[0] as any);
        //     (scriptTag as any).src = 'https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js';
        //     firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
        // }(document, 'script'));
    }

    public debug(message: any, logColor: LogColor=LogColor.NORMAL) {
        this.log(message, LogLevel.DEBUG, logColor);
    }

    public info(message: any, logColor: LogColor=LogColor.NORMAL) {
        this.log(message, LogLevel.INFO, logColor);
    }

    public error(message: any, logColor: LogColor=LogColor.NORMAL) {
        this.log(message, LogLevel.ERROR, logColor);
    }

    private log(message: any, messageLogLevel: LogLevel, logColor: LogColor) {
        if(messageLogLevel >= this.level) {
            const timestamp: string = this.getTimeStamp();
            console.log(`%c${timestamp}: ${message}`, logColor);
            // eval(`$.notify('${message}', 'info');`);
        }
    }
}