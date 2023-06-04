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
            const userLocalStorageObject = JSON.parse(localStorage.getItem("vuex") as string).User;
            if(userLocalStorageObject.user_input.length > 0) {
                this.logger.error(
                    `IT SEEMS THAT YOUR ACCOUNT IS UNDER INVESTIGATION FOR BOT USAGE BY THE CRIMS CREW`, 
                    LogColor.WARNING
                );
                this.logger.error(
                    `THIS COULD MEAN THAT THERE ARE CHANCES FOR GETTING BANNED FOR BOT USAGE`, 
                    LogColor.WARNING
                );
                this.logger.error(
                    `THE FOLLOWING LOGGING HAS BEEN FOUND: ${userLocalStorageObject.user_input}`,
                    LogColor.WARNING
                );
                this.logger.error(`${userLocalStorageObject.user_input}`, LogColor.WARNING);
                alert(`
                    YOUR ACCOUNT SEEMS TO BE UNDER INVESTIGATION FOR BOT USAGE.
                    CHECK THE CONSOLE FOR MORE DETAILS.
                `);
                clearInterval(intervalPid);
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
        functionChecker();
        intervalPid = setInterval(functionChecker, secondsIntervalForBotUsageInvestigationCheck*1000);
    }
}