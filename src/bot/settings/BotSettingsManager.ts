import { singleton } from "tsyringe";
import { LogLevel } from "../../logger/Logger";
import { BotSettings } from "./BotSettings";

@singleton()
export class BotSettingsManager {
    private botSetting: BotSettings;

    constructor() {
        this.botSetting = {
            rechargeEnergy: {
                useRandomRaveForRecharge: true,
                ticketsStopLimit: 1,
                millisecondsToWaitAfterEnterRave: {
                    min: 0,
                    max: 200,
                },
                millisecondsToWaitAfterEnterRaveIfVisitorInside:{
                    min: 0,
                    max: 100,
                },
                millisecondsToWaitAfterExitRave: {
                    min: 0,
                    max: 500,
                },
                millisecondsToWaitAfterClickExitButton: {
                    min: 0,
                    max: 200,
                },
                pixelsRadiusOfRandomMovementAroundBuyButton: 100
            },
            mouse: {
                numberOfCoordinatesToSkip: 8
            },
            logger: {
                level: LogLevel.INFO
            },
            detox: {
                threshold: {
                    min: 25,
                    max: 65
                }
            },
            singleAssault: {
                forceExitAfterMillis: 4000,
                millisecondsToWaitAfterAssault: {
                    min: 6000,
                    max: 7000
                },
                millisecondsToWaitAfterExitRave: {
                    min: 5000,
                    max: 6000
                },
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
                millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore: {
                    min: 0,
                    max: 500
                }
            }
        }
    }

    public getBotSettings(): BotSettings {
        return this.botSetting;
    }
}