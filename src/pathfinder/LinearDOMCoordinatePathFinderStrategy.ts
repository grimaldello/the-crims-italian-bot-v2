import { DOMCoordinate } from "../commons/DOMCoordinate";
import { IDOMCoordinatePathFinderStrategy } from "./IDOMCoordinatePathFinderStrategy";

export class LinearDOMCoordinatePathFinderStrategy implements IDOMCoordinatePathFinderStrategy {

    findPath(startCoordinate: DOMCoordinate, endCoordinate: DOMCoordinate): DOMCoordinate[] {

        const pathDOMCoordinate: DOMCoordinate[] = [];

        const distX: number = endCoordinate.x - startCoordinate.x;
        const distY: number = endCoordinate.y - startCoordinate.y;

        const distance: number = Math.sqrt(distX*distX + distY*distY);

        const intervalX: number = distX / (distance);
        const intervalY: number = distY / (distance);

        for(let i=0; i < distance; i++) {
            pathDOMCoordinate.push({
                x: Math.ceil(startCoordinate.x + intervalX*i),
                y: Math.ceil(startCoordinate.y + intervalY*i)
            });
        }

        return pathDOMCoordinate;
    }
    
}