import { DOMCoordinate } from "../commons/DOMCoordinate";
import { IDOMCoordinatePathFinderStrategy } from "./IDOMCoordinatePathFinderStrategy";

export class CurveDOMCoordinatePathFinderStrategy implements IDOMCoordinatePathFinderStrategy {

    findPath(startCoordinate: DOMCoordinate, endCoordinate: DOMCoordinate): DOMCoordinate[] {

        const pathDOMCoordinate: DOMCoordinate[] = [];

        const distX: number = endCoordinate.x - startCoordinate.x;
        const distY: number = endCoordinate.y - startCoordinate.y;

        const distance: number = Math.sqrt(distX*distX + distY*distY);

        const intervalX: number = distX / (distance);
        const intervalY: number = distY / (distance);

        let variationAmount: number = 0;
        let variation: number = Math.random() * (0.9 - 0.1) + 0.1;

        for(let i=0; i < distance; i++) {
            if(i > Math.ceil(distance/2)) {
                variationAmount -= variation;
            }
            else {
                variationAmount += variation;
            }
            pathDOMCoordinate.push({
                x: Math.ceil(startCoordinate.x + intervalX*i + variationAmount),
                y: Math.ceil(startCoordinate.y + intervalY*i + variationAmount)
            });
        }

        return pathDOMCoordinate;
    }
    
}