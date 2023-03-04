import { singleton } from "tsyringe";

export interface IBotEventAction {
    executeAction(data: any): void;
}