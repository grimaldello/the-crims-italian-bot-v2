import { container, singleton } from "tsyringe";
import { LogColor, Logger } from "../logger/Logger";
import { BotSettingsManager } from "./settings/BotSettingsManager";

@singleton()
export class AccountUnderInvestigationAuditorService {

    private logger: Logger;
    private botSettingsManager: BotSettingsManager;

    constructor() {
        this.logger = container.resolve(Logger);
        this.botSettingsManager = container.resolve(BotSettingsManager);
    }

    public startCheck(): void {
        const secondsIntervalForBotUsageInvestigationCheck: number = 
            this.botSettingsManager.getBotSettings().general.secondsIntervalForBotUsageInvestigationCheck;

        this.logger.info("Performing check if account is under investigation for bot usage by the crew");
        this.logger.info(
            `This check will be performed each ${secondsIntervalForBotUsageInvestigationCheck} seconds in case it is not found at the start of the bot.`
        );

        let intervalPid: any;
        const functionChecker = () =>{
            
            // ###### TEST MOCK ######
            // Uncomment the lines below to simulate bot investigation
            // const userLocalStorageObject = JSON.parse(localStorage.getItem("test") as string).User;
            // localStorage.setItem("test",JSON.stringify({User:{user_input:[{a: "aaa"},{b: "bbb"},{c: "ccc"}]}}));
            // ########################
            
            const userLocalStorageObject = JSON.parse(localStorage.getItem("vuex") as string).User;
            
            if(userLocalStorageObject.user_input.length > 0) {
                
                clearInterval(intervalPid);

                this.logger.error(
                    `IT SEEMS THAT YOUR ACCOUNT IS UNDER INVESTIGATION FOR BOT USAGE BY THE CRIMS CREW`, 
                    LogColor.WARNING
                );
                this.logger.error(
                    `THIS COULD MEAN THAT THERE ARE CHANCES YOU GET BANNED FOR BOT USAGE IF YOU CONTINUE TO USE THE BOT`, 
                    LogColor.WARNING
                );
                this.logger.error(
                    [
                        `THE CREW IS TRACKING YOUR MOUSE MOVEMENTS AND CLICK.`,
                        `HERE SOME OF THE DATA GATHERED:`
                    ].join(" "),
                    LogColor.WARNING
                );

                const stringifiedLogs: string = JSON.stringify(userLocalStorageObject.user_input,null,2);

                this.logger.error(`${stringifiedLogs}`, LogColor.WARNING);

                this.logger.error([
                        "YOU CAN IGNORE THIS WARNING MESSAGE AND CONTINUE TO USE THE BOT",
                        "OR STOP USE IT BY PRESSING REFRESH BUTTON OF THE BROWSER"
                    ].join(" "),
                    LogColor.WARNING
                );

                alert(
                    "YOUR ACCOUNT SEEMS TO BE UNDER INVESTIGATION FOR BOT USAGE." +
                    "\n" +
                    "CHECK THE CONSOLE FOR MORE DETAILS."
                );
            }
            else {
                this.logger.info(
                    "Your account is NOT under investigation for bot usage by The Crims crew",
                    LogColor.SUCCESS
                );
                this.logger.info(
                    "No logging has been found.",
                    LogColor.SUCCESS
                );
                this.logger.info(
                    `A new check will performed in ${secondsIntervalForBotUsageInvestigationCheck} seconds`,
                    LogColor.SUCCESS
                );
            }
        };
        intervalPid = setInterval(functionChecker, secondsIntervalForBotUsageInvestigationCheck*1000);
        functionChecker();
    }
}