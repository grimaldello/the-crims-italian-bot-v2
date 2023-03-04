import { singleton } from "tsyringe";

@singleton()
export class RandomUtils {
    
    public intBetween(min: number, max: number): number {
        const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    public floatBetween(min: number, max: number): number {
        const randomNumber: number = Math.random() * (max - min) + min;
        return randomNumber;
    }

    public randomTrueOrFalse(): boolean {
        const decision: number = this.intBetween(0,1);
        return decision === 0 ? false : true;
    }
}