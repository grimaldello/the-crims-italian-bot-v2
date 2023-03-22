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
    victimIdsToAvoidToKillList: string[]

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