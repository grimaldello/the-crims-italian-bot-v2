import { singleton } from "tsyringe";
import { DOMCoordinate } from "../commons/DOMCoordinate";

@singleton()
export class DOMCoordinateQueue {
    private queue: DOMCoordinate[] = [];
    private counter: number = 0;
    private isBlocked: boolean = false;

    public setQueue(newQueue: DOMCoordinate[]) {
        this.queue = newQueue;
        this.counter = newQueue.length -1;
    }

    public getCounter() {
        return this.counter;
    }

    public popFirst(): DOMCoordinate {
        const nextCoordinate: DOMCoordinate = (this.queue.shift() as DOMCoordinate);
        this.counter--;
        return nextCoordinate;
    }

    public isLastCoordinate(): boolean {
        return this.queue.length === 0;
    }

    public getIsBlocked(): boolean {
        return this.isBlocked;
    } 

    public setIsBlocked(isBlocked: boolean): void {
        this.isBlocked = isBlocked;
    }
}