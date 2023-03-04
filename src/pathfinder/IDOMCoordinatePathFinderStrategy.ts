import { DOMCoordinate } from "../commons/DOMCoordinate";


export interface IDOMCoordinatePathFinderStrategy {
    findPath(startCoordinate: DOMCoordinate, endCoordinate: DOMCoordinate): DOMCoordinate[];
}