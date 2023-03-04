import { DOMCoordinate } from "../commons/DOMCoordinate";
import { IDOMCoordinateStrategy } from "./IDOMCoordinateStrategy";

export class MiddleHTMLElementDOMCoordinateStrategy implements IDOMCoordinateStrategy{

    public getCoordinate(htmlElement: HTMLElement): DOMCoordinate | null {
        
        const htmlElementDOMRect: DOMRect = htmlElement.getBoundingClientRect();

        const htmlElementWidth = htmlElementDOMRect.right - htmlElementDOMRect.left;
        const htmlElementHeight = htmlElementDOMRect.bottom - htmlElementDOMRect.top;

        const htmlELementMiddlePointX: number = (htmlElementWidth / 2) + htmlElementDOMRect.left;
        const htmlELementMiddlePointY: number = (htmlElementHeight / 2) + htmlElementDOMRect.top;

        // Return the point of HTMLElement with the respective offset
        return {
            x: htmlELementMiddlePointX,
            y: htmlELementMiddlePointY,
        };
    }

}