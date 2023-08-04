import { singleton } from "tsyringe";

@singleton()
export class BotSpeedModifier {

    private speedFactor: number;

    constructor() {
        this.speedFactor = 0;
    }

    public setSpeedFactor(speedFactor: number): void {
        this.speedFactor = speedFactor;
    }

    public getSpeedFactor(): number {
        return this.speedFactor;
    }

}