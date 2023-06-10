import { singleton } from "tsyringe";
import { LogLevel } from "../../logger/Logger";
import { BotSettings } from "./BotSettings";

@singleton()
export class BotSettingsManager {
    private botSettings: BotSettings;

    constructor() {
        this.botSettings = {
            general: {
                secondsIntervalForBotUsageInvestigationCheck: 60,
                querySelectorsDOMElementsToRemove: [],
                pauseResume: {
                    ctrlOrMetaKeyNecessary: true,
                    altKeyNecessary: true,
                    keyboardKeyForPauseResumeBot: "s"
                }
            },
            coordinatePathStrategy: {
                useLinearPathStrategy: false,
                useWindPathStrategy: true
            },
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
                numberOfCoordinatesToSkip: 4
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
                criteriaAssault: {
                    CHARACTER_BROKER: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    },
                    CHARACTER_PIMP: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    },
                    CHARACTER_DEALER: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    },
                    CHARACTER_ROBBER: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    },
                    CHARACTER_BIZ: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    },
                    CHARACTER_HITMAN: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    },
                    CHARACTER_GANGSTER: {
                        maxLevel: 13,
                        minRespect: 200,
                        maxRespect: 100000000
                    }
                },
                forceExitAfterMillis: 4000,
                millisecondsToWaitAfterEnterRaveIfVisitorInside: {
                    min: 0,
                    max: 100,
                },
                millisecondsToWaitAfterAssault: {
                    min: 6000,
                    max: 7000
                },
                millisecondsToWaitAfterExitRave: {
                    min: 5000,
                    max: 6000
                },
                millisecondsToWaitAfterExitRaveIfPerformedAssault: {
                    min: 5000,
                    max: 6000
                },
                victimUsernameToAvoidToKillList: [],
                victimIdsToAvoidToKillList: []
            },
            singleRobbery: {
                makeRandomMovement: true
            },
            gangRobbery: {
                makeRandomMovement: true,
                millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore: {
                    min: 0,
                    max: 500
                },
                clickOnDoTheScoreButton: true
            }
        }
    }

    public getBotSettings(): BotSettings {
        return this.botSettings;
    }
}