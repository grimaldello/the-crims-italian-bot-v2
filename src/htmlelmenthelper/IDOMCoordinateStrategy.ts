import { DOMCoordinate } from "../commons/DOMCoordinate";

export interface IDOMCoordinateStrategy {
    getCoordinate(htmlElement: HTMLElement): DOMCoordinate | null;
}