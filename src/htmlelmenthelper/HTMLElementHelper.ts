import { container, inject, injectable } from "tsyringe";
import { DOMCoordinate } from "../commons/DOMCoordinate";
import { RandomUtils } from "../commons/RandomUtils";
import { IDOMCoordinateStrategy } from "./IDOMCoordinateStrategy";

@injectable()
export class HTMLElementHelper {

    private domCoordinateStrategy: IDOMCoordinateStrategy;
    private randomUtils: RandomUtils;

    constructor(
        @inject("randomHTMLElementDOMCoordinateStrategy") domCoordinateStrategy: IDOMCoordinateStrategy,
    ) {
        this.domCoordinateStrategy = domCoordinateStrategy;
        this.randomUtils = container.resolve(RandomUtils);
    }

    public getHTMLElementDOMCoordinate(htmlElement: HTMLElement): DOMCoordinate | null {
        return this.domCoordinateStrategy.getCoordinate(htmlElement);
    }

    public getDOMCoordinateElementByQuerySelectorAllIndex(querySelector: string, index: number): DOMCoordinate | null {
        let domCoordinate: DOMCoordinate | null = null;
        
        const nodeList: NodeListOf<Element> = window.document.querySelectorAll(querySelector);

        // const randomIndex: number = this.randomUtils.intBetween(0, nodeList.length-1);

        if(nodeList != null) {
            domCoordinate = this.getHTMLElementDOMCoordinate(nodeList[index] as HTMLElement);
        }
        else {
            console.error(`The HTMLElement with query selector '${querySelector}' cannot be found`);
        }
        return domCoordinate;
    }

    public getDOMCoordinateByQuerySelector(querySelector: string): DOMCoordinate | null {
        let domCoordinate: DOMCoordinate | null = null;
        
        const htmlElement: HTMLElement | null = window.document.querySelector(querySelector);

        if(htmlElement != null) {
            domCoordinate = this.getHTMLElementDOMCoordinate(htmlElement);
        }
        else {
            console.error(`The HTMLElement with query selector '${querySelector}' cannot be found`);
        }
        return domCoordinate;
    }

    public getDOMCoordinateById(id: string): DOMCoordinate | null {

        return this.getDOMCoordinateByQuerySelector(`[id="${id}"]`);

    }

    public setDOMCoordinateStrategy(newDOMCoordinateStrategy: IDOMCoordinateStrategy) {
        this.domCoordinateStrategy = newDOMCoordinateStrategy;
    }
}