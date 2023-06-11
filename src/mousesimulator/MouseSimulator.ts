import { container, singleton } from "tsyringe";
import { DOMCoordinate } from "../commons/DOMCoordinate";
import { RandomUtils } from "../commons/RandomUtils";

@singleton()
export class MouseSimulator {

    // private dispatcher: DOMCoordinateEventDispatcher = container.resolve(DOMCoordinateEventDispatcher);
    private fakeCursor: HTMLElement;
    private randomUtils: RandomUtils;

    constructor() {
        this.randomUtils = container.resolve(RandomUtils);
        this.fakeCursor = this.createDefaultCursor();
        document.body.prepend(this.fakeCursor);

    }

    private createDefaultCursor(): HTMLElement {
        const cursorStyle = `
            background-color: red;
            height: 5px; 
            width: 5px; 
            border-radius: 50%;
            display: inline-block;
            z-index: 10000; position: absolute;
        `;
        const defaultFakeCursor = document.createElement("span");
        defaultFakeCursor.setAttribute("id", "fakeCursor");
        defaultFakeCursor.setAttribute("style", cursorStyle);
        defaultFakeCursor.style.top = this.randomUtils.intBetween(0, window.innerWidth) + "px";
        defaultFakeCursor.style.left = this.randomUtils.intBetween(0, window.innerWidth) + "px";
        return defaultFakeCursor;
    }

    private makeMouseEventInit(coordinate: DOMCoordinate): MouseEventInit {
        return {
            view: window,
            bubbles: true,
            cancelable: false,
            clientX: coordinate.x,
            clientY: coordinate.y,
            button: 0
        };
    }

    private makeMouseDownEvent(mouseEventInit: MouseEventInit): MouseEvent {
        return new MouseEvent("mousedown", mouseEventInit);
    }

    private makeMouseUpEvent(mouseEventInit: MouseEventInit): MouseEvent {
        return new MouseEvent("mouseup", mouseEventInit);
    }

    private makeMouseMoveEvent(mouseEventInit: MouseEventInit): MouseEvent {
        return new MouseEvent("mousemove", mouseEventInit);
    }

    private makeMouseClickEvent(mouseEventInit: MouseEventInit): MouseEvent {
        return new MouseEvent("click", mouseEventInit);
    }

    private dispatch(element: Element, event: Event) {
        if(element !== null) {
            element.dispatchEvent(event);
        }
        else {
            console.error(`Cannot dispatch event to element`);
        }
    }

    /**
    * @returns The current fakeCursor coordinate in the DOM
    */
    public getFakeCursorDOMCoordinate(): DOMCoordinate {
        return {
            x: this.fakeCursor.getBoundingClientRect().left,
            y: this.fakeCursor.getBoundingClientRect().top
        }
    }

    private moveFakeCursor(coordinate: DOMCoordinate) {
        this.fakeCursor.style.top = coordinate.y + "px";
        this.fakeCursor.style.left = coordinate.x + "px";
    }

    private dispatchMoveEvent(coordinate: DOMCoordinate) {
        const mouseEventInit: MouseEventInit = this.makeMouseEventInit(coordinate);
        const mouseMoveEvent: MouseEvent = this.makeMouseMoveEvent(mouseEventInit);
        const element: Element | null = document.elementFromPoint(coordinate.x, coordinate.y);

        this.dispatch((element as Element), mouseMoveEvent);
    }

    public setCustomFakeCursor(customFakeCursorHTMLElement: HTMLElement) {
        this.fakeCursor = customFakeCursorHTMLElement;
    }

    public click() {
        const currentFakeMouseCoordinate: DOMCoordinate = this.getFakeCursorDOMCoordinate();
        const mouseEventInit: MouseEventInit = this.makeMouseEventInit(currentFakeMouseCoordinate);
        
        const mouseDownEvent: MouseEvent = this.makeMouseDownEvent(mouseEventInit);
        const mouseUpEvent: MouseEvent = this.makeMouseUpEvent(mouseEventInit);
        const mouseClickEvent: MouseEvent = this.makeMouseClickEvent(mouseEventInit);
        
        
        const elementsUnderCurrentCoordinate: Element[] | null = 
            document.elementsFromPoint(currentFakeMouseCoordinate.x, currentFakeMouseCoordinate.y);

        let elementToClick: Element | null;
        
        if(elementsUnderCurrentCoordinate[0].getAttribute("id") !== "fakeCursor") {
            elementToClick = elementsUnderCurrentCoordinate[0];
        }
        else {
            elementToClick = elementsUnderCurrentCoordinate[1];
        }
        
        this.dispatch((elementToClick as Element), mouseDownEvent);
        this.dispatch((elementToClick as Element), mouseUpEvent);
        this.dispatch((elementToClick as Element), mouseClickEvent);
    }

    public move(coordinate: DOMCoordinate) {
        this.moveFakeCursor(coordinate);
        this.dispatchMoveEvent(coordinate);
    }
}