import { container } from "tsyringe";
import { DOMCoordinate } from "../commons/DOMCoordinate";
import { RandomUtils } from "../commons/RandomUtils";
import { IDOMCoordinateStrategy } from "./IDOMCoordinateStrategy";

export class RandomHTMLElementDOMCoordinateStrategy implements IDOMCoordinateStrategy {

    private reduceTopByPixel: number = 5;
    private reduceRightByPixel: number = 5;
    private reduceBottomByPixel: number = 5;
    private reduceLeftByPixel: number = 5;
    private randomUtils: RandomUtils = container.resolve(RandomUtils);

    constructor() {}
    
    public setReduce(top: number, right: number, bottom: number, left: number) {
            this.reduceTopByPixel = top;
            this.reduceRightByPixel = right; 
            this.reduceBottomByPixel = bottom; 
            this.reduceLeftByPixel = left; 

    }

    public getCoordinate(htmlElement: HTMLElement): DOMCoordinate | null {
        const htmlElementDOMRect: DOMRect = htmlElement.getBoundingClientRect();

        const htmlElementTop: number = htmlElementDOMRect.top + this.reduceTopByPixel;
        const htmlElementRight: number = htmlElementDOMRect.right - this.reduceRightByPixel;
        const htmlElementBottom: number = htmlElementDOMRect.bottom - this.reduceBottomByPixel;
        const htmlElementLeft: number = htmlElementDOMRect.left + this.reduceLeftByPixel;

        const htmlElementRandomPointX: number = 
            this.randomUtils.intBetween(htmlElementLeft, htmlElementRight);

        const htmlElementRandomPointY: number = 
            this.randomUtils.intBetween(htmlElementTop, htmlElementBottom);

        // Return the point of HTMLElement with the respective offset
        return {
            x: htmlElementRandomPointX,
            y: htmlElementRandomPointY,
        };
    }

}