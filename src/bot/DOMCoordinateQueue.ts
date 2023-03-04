import { DOMCoordinate } from "../commons/DOMCoordinate";

export class DOMCoordinateQueue {
    private queue: DOMCoordinate[] = [];
    private counter: number = 0;

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
}