import { singleton } from "tsyringe";
import { LogLevel } from "../../logger/Logger";
import { BotSettings } from "./BotSettings";

@singleton()
export class BotSettingsManager {
    private botSetting: BotSettings;

    constructor() {
        this.botSetting = {
            rechargeEnergy: {
                ticketsStopLimit: 1
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
            }
        }
    }

    public getBotSettings(): BotSettings {
        return this.botSetting;
    }
}