import { DOMCoordinate } from "../commons/DOMCoordinate";
import { IDOMCoordinatePathFinderStrategy } from "./IDOMCoordinatePathFinderStrategy";

export class TailWindDOMCoordinatePathFinderStrategy implements IDOMCoordinatePathFinderStrategy {

    // private readonly mouseSpeed: number = Math.floor(Math.random() * 10);
    // private readonly randomSeed: number =  Math.floor(Math.random() * 10);
    // private readonly randomSpeed: number = Math.max((this.randomSeed / 2.0 + this.mouseSpeed) / 10.0, 0.1);
    private maxStep: number = Math.ceil(Math.random() * 1);
    
    private readonly wind: number = Math.ceil(Math.random() * 1);
    private readonly gravity: number = Math.ceil(Math.random() * 1);
    private readonly targetArea: number = Math.ceil(Math.random() * 1);
    
    private readonly minWait: number = 2;
    private readonly maxWait: number = Math.ceil(Math.random() * 5);
    private readonly waitDiff: number = this.maxWait - this.minWait;
    
    private readonly sqrt2: number = Math.sqrt(2.0);
    private readonly sqrt3: number = Math.sqrt(3.0);
    private readonly sqrt5: number = Math.sqrt(5.0);

    constructor() {
    }

    findPath(startCoordinate: DOMCoordinate, endCoordinate: DOMCoordinate): DOMCoordinate[] {

        let dist: number = 
            this.calculateHypotenuse(endCoordinate.x - startCoordinate.x, endCoordinate.y - startCoordinate.y);

        let windX: number = Math.floor(Math.random() * 1);
        let windY: number = Math.floor(Math.random() * 1);
        let velocityX: number = 0;
        let velocityY: number = 0;
        let randomDist: number;
        let veloMag: number;
        let step: number;

        let oldX: number;
        let oldY: number;
        let newX: number = Math.round(startCoordinate.x);
        let newY: number = Math.round(startCoordinate.y);

        const domCoordinateList: DOMCoordinate[] = [];
        let currentWait: number = 0;

        while(dist > 1) {
            let currentWind = Math.min(this.wind, dist);

            if (dist >= this.targetArea) {
                const w: number = Math.floor(Math.random() * Math.round(currentWind) * 2 + 1);
        
                windX = windX / this.sqrt3 + (w - currentWind) / this.sqrt5;
                windY = windY / this.sqrt3 + (w - currentWind) / this.sqrt5;
             } else {
                windX = windX / this.sqrt2;
                windY = windY / this.sqrt2;
                if (this.maxStep < 3) {
                    this.maxStep = Math.floor(Math.random() * 3) + 3.0;
                }
                else {
                    this.maxStep = this.maxStep / this.sqrt5;
                }
            }

            velocityX += windX;
            velocityY += windY;
            velocityX = velocityX + (this.gravity * (endCoordinate.x - startCoordinate.x)) / dist;
            velocityY = velocityY + (this.gravity * (endCoordinate.y - startCoordinate.y)) / dist;

            if (this.calculateHypotenuse(velocityX, velocityY) > this.maxStep) {
                randomDist = this.maxStep / 2.0 + Math.floor((Math.random() * Math.round(this.maxStep)) / 2);
                veloMag = this.calculateHypotenuse(velocityX, velocityY);
                velocityX = (velocityX / veloMag) * randomDist;
                velocityY = (velocityY / veloMag) * randomDist;
            }

            oldX = Math.round(startCoordinate.x);
            oldY = Math.round(startCoordinate.y);
            startCoordinate.x += velocityX;
            startCoordinate.y += velocityY;
            dist = this.calculateHypotenuse(endCoordinate.x - startCoordinate.x, endCoordinate.y - startCoordinate.y);
            newX = Math.round(startCoordinate.x);
            newY = Math.round(startCoordinate.y);

            step = this.calculateHypotenuse(startCoordinate.x - oldX, startCoordinate.y - oldY);
            const wait = Math.round(this.waitDiff * (step / this.maxStep) + this.minWait);
            currentWait += wait;

            if (oldX !== newX || oldY !== newY) {
                domCoordinateList.push({x: newX, y: newY, millisecondsToWait: currentWait/1000});
            }
        }

        const endX: number = Math.round(endCoordinate.x);
        const endY: number = Math.round(endCoordinate.y);

        if (endX !== newX || endY !== newY) {
            domCoordinateList.push({x: newX, y: newY, millisecondsToWait: currentWait/1000});
        }

        return domCoordinateList;
    }

    private calculateHypotenuse(dx: number, dy: number): number {
        return Math.sqrt(dx * dx + dy * dy);
    }
    
}