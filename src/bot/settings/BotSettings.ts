import { LogLevel } from "../../logger/Logger"

export interface RechargeEnergySettings {
    ticketsStopLimit: number
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
}