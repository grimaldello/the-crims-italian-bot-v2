import { singleton } from "tsyringe";
import { LogLevel } from "../../logger/Logger";
import { BotSettings } from "./BotSettings";

@singleton()
export class BotSettingsManager {
    private botSetting: BotSettings;

    constructor() {
        this.botSetting = {
            rechargeEnergy: {
                ticketsStopLimit: 1,
                millisecondsToWaitAfterEnterRave: 200,
                millisecondsToWaitAfterEnterRaveIfVisitorInside: 100,
                millisecondsToWaitAfterExitRave: 500,
                millisecondsToWaitAfterClickExitButton: 200,
                pixelsRadiusOfRandomMovementAroundBuyButton: 100
            },
            mouse: {
                numberOfCoordinatesToSkip: 8
            },
            logger: {
                level: LogLevel.INFO
            },
            detox: {
                threshold: 75
            },
            singleAssault: {
                forceExitAfterMillis: 4000,
                hitman: {
                    minRespect: 200,
                    maxRespect: 100000
                },
                notHitman: {
                    minRespect: 200,
                    maxRespect: 100000
                }
            },
            singleRobbery: {
                makeRandomMovement: true
            },
            gangRobbery: {
                makeRandomMovement: true,
                millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore: 500
            }
        }
    }

    public getBotSettings(): BotSettings {
        return this.botSetting;
    }
}