import { LogLevel } from "../../logger/Logger"

export interface RechargeEnergySettings {
    ticketsStopLimit: number,
    millisecondsToWaitAfterEnterRave: any
    millisecondsToWaitAfterEnterRaveIfVisitorInside: any,
    millisecondsToWaitAfterExitRave: any,
    millisecondsToWaitAfterClickExitButton: any,
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
    }
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
    millisecondsToWaitAfterAssault: any,
    millisecondsToWaitAfterExitRave: any
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