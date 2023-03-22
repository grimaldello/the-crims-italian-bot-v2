import { LogLevel } from "../../logger/Logger"

export interface RechargeEnergySettings {
    ticketsStopLimit: number,
    millisecondsToWaitAfterEnterRave: {
        min: number,
        max: number
    }
    millisecondsToWaitAfterEnterRaveIfVisitorInside: {
        min: number,
        max: number
    },
    millisecondsToWaitAfterExitRave: {
        min: number,
        max: number
    },
    millisecondsToWaitAfterClickExitButton: {
        min: number,
        max: number
    },
    pixelsRadiusOfRandomMovementAroundBuyButton: number,
    useRandomRaveForRecharge: boolean
}

export interface SingleRobberySettings {
    makeRandomMovement: boolean,
}

export interface GangRobberySettings {
    makeRandomMovement: boolean,
    millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore: {
        min: number,
        max: number
    },
    clickOnDoTheScoreButton: boolean
}

export interface Mouse {
    numberOfCoordinatesToSkip: number
}

export interface LoggerSettings {
    level: LogLevel
}

export interface DetoxSettings {
    threshold: any
}

export interface HitmanSettings {
    minRespect: number,
    maxRespect: number
}

export interface NotHitmanSettings {
    minRespect: number,
    maxRespect: number
}

export interface SingleAssaultSettings {
    forceExitAfterMillis: number,
    hitman: HitmanSettings,
    notHitman: NotHitmanSettings,
    millisecondsToWaitAfterAssault: {
        min: number,
        max: number
    },
    millisecondsToWaitAfterExitRave: {
        min: number,
        max: number
    },
    victimUsernameToAvoidToKillList: string[],
    victimIdsToAvoidToKillList: string[],
    criteriaAssault: SingleAssaultCriteriaDefinition
}


export interface CharacterSingleAssaultCriteria {
    maxLevel: number,
    minRespect: number,
    maxRespect: number
}


export interface SingleAssaultCriteriaDefinition {
    CHARACTER_BROKER: CharacterSingleAssaultCriteria,
    CHARACTER_PIMP: CharacterSingleAssaultCriteria,
    CHARACTER_DEALER: CharacterSingleAssaultCriteria,
    CHARACTER_ROBBER:CharacterSingleAssaultCriteria,
    CHARACTER_BIZ: CharacterSingleAssaultCriteria,
    CHARACTER_HITMAN: CharacterSingleAssaultCriteria,
    CHARACTER_GANGSTER: CharacterSingleAssaultCriteria
}

export interface BotSettings {
    mouse: Mouse,
    logger: LoggerSettings,
    detox: DetoxSettings,
    singleAssault: SingleAssaultSettings,
    rechargeEnergy: RechargeEnergySettings
    singleRobbery: SingleRobberySettings,
    gangRobbery: GangRobberySettings
}

export class ProfessionLevelMapping {

    private static mapping: Map<string, number> = new Map([
        // Levels 13
        ['LEVEL_GODFATHER', 13],
        // Levels 12
        ['LEVEL_PADRINO', 12],
        // Levels 11
        ['LEVEL_MOBSTER', 11],
        // Levels 10
        ['LEVEL_KINGPIN', 10],
        // Levels 9
        ['LEVEL_DON', 9],
        ['LEVEL_BUSINESSMAN_TOP_EXECUTIVE', 9],
        ['LEVEL_PIMP_BITCH_RULER', 9],
        ['LEVEL_ROBBER_MUGGER', 9],
        ['LEVEL_HITMAN_DESPERADO', 9],
        // Levels 8
        ['LEVEL_BOSS', 8],
        ['LEVEL_BUSINESSMAN_DIRECTOR', 8],
        ['LEVEL_ROBBER_LARCENIST', 8],
        ['LEVEL_PIMP_PANDER', 8],
        ['LEVEL_HITMAN_BUTCHER', 8],
        // Levels 7
        ['LEVEL_BUSINESSMAN_MANAGER', 7],
        ['LEVEL_PIMP_PROCURER', 7],
        ['LEVEL_CONSIGLIERE', 7],
        ['LEVEL_HITMAN_MURDERER', 7],
        ['LEVEL_ROBBER_BURGLAR', 7],
        // Levels 6
        ['LEVEL_ROBBER_CROOK', 6],
        ['LEVEL_BUSINESSMAN_BANKER', 6],
        ['LEVEL_HITMAN_CUT_THROAT', 6],
        ['LEVEL_PIMP_PLAYER', 6],
        ['LEVEL_CAPO', 6],
        // Levels 5
        ['LEVEL_BUSINESSMAN_ENTREPRENEUR', 5],
        ['LEVEL_ROBBER_SHOPLIFTER', 5],
        ['LEVEL_MAFIOSO', 5],
        ['LEVEL_PIMP_PET_OWNER', 5],
        ['LEVEL_HITMAN_GARROTTER', 5],
        // Levels 4
        ['LEVEL_THUG', 4],
        ['LEVEL_BUSINESSMAN_EMPLOYER', 4],
        ['LEVEL_HITMAN_GOON', 4],
        ['LEVEL_ROBBER_PICKPOCKET', 4],
        ['LEVEL_PIMP_BAWD', 4],
        // Levels 3
        ['LEVEL_BUSINESSMAN_SWINDLER', 3],
        ['LEVEL_HITMAN_BRAVO', 3],
        ['LEVEL_PIMP_GIGOLO', 3],
        ['LEVEL_ROBBER_SNITCH', 3],
        ['LEVEL_CRIMINAL', 3],
        // Levels 2
        ['LEVEL_HITMAN_BRUISER', 2],
        ['LEVEL_ROBBER_NEWBIE', 2],
        ['LEVEL_BUSINESSMAN_WARE_SLAVE', 2],
        ['LEVEL_HANGAROUND', 2],
        ['LEVEL_PIMP_POPCORN', 2],
        // Levels 1
        ['LEVEL_PROSPECT', 1],
      ]);

      public static getLevelByLevelTextName(levelTextName: string): number {
        return this.mapping.get(levelTextName) as number;
      }
}