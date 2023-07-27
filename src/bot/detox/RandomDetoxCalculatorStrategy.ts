import { container, singleton } from "tsyringe";
import { IDetoxCalculatorStrategy } from "./IDetoxCalculatorStrategy";
import { BotSettingsManager } from "../settings/BotSettingsManager";
import { RandomUtils } from "../../commons/RandomUtils";

@singleton()
export class RandomDetoxCalculatorStrategy implements IDetoxCalculatorStrategy {

    private botSettingsManager: BotSettingsManager;
    private randomUtils: RandomUtils;

    constructor() {
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.randomUtils = container.resolve(RandomUtils);
    }

    getDetoxThresholdValue(): number {
        return this.randomUtils.intBetween(
            this.botSettingsManager.getBotSettings().detox.threshold.min,
            this.botSettingsManager.getBotSettings().detox.threshold.max
        );
    }
}