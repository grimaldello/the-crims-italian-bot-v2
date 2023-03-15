import { LogLevel } from "../../logger/Logger"

export interface RechargeEnergySettings {
    ticketsStopLimit: number,
    millisecondsToWaitAfterEnterRave: number,
    millisecondsToWaitAfterEnterRaveIfVisitorInside: number,
    millisecondsToWaitAfterExitRave: number,
    millisecondsToWaitAfterClickExitButton: number,
    pixelsRadiusOfRandomMovementAroundBuyButton: number
}

export interface SingleRobberySettings {
    makeRandomMovement: boolean,
}

export interface GangRobberySettings {
    makeRandomMovement: boolean,
    millisecondsToWaitBeforeCheckButtonAcceptOrDoTheScore: number
}

export interface Mouse {
    numberOfCoordinatesToSkip: number
}

export interface LoggerSettings {
    level: LogLevel
}

export interface DetoxSettings {
    threshold: number
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
    notHitman: NotHitmanSettings
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