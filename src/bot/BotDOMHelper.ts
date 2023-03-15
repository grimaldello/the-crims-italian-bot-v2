import { container, singleton } from "tsyringe";
import { DOMCoordinate } from "../commons/DOMCoordinate";
import { RandomUtils } from "../commons/RandomUtils";
import { WaitUtils } from "../commons/WaitUtils";
import { HTMLElementHelper } from "../htmlelmenthelper/HTMLElementHelper";
import { MiddleHTMLElementDOMCoordinateStrategy } from "../htmlelmenthelper/MiddleHTMLElementDOMCoordinateStrategy";
import { RandomHTMLElementDOMCoordinateStrategy } from "../htmlelmenthelper/RandomHTMLElementDOMCoordinateStrategy";
import { LogColor, Logger } from "../logger/Logger";
import { MouseSimulator } from "../mousesimulator/MouseSimulator";
import { IDOMCoordinatePathFinderStrategy } from "../pathfinder/IDOMCoordinatePathFinderStrategy";
import { LinearDOMCoordinatePathFinderStrategy } from "../pathfinder/LinearDOMCoordinatePathFinderStrategy";
import { DOMCoordinateQueue } from "./DOMCoordinateQueue";
import { BotSettingsManager } from "./settings/BotSettingsManager";

@singleton()
export class BotDOMHelper {

    private mouse: MouseSimulator;
    private helper: HTMLElementHelper;
    private pathFinder: IDOMCoordinatePathFinderStrategy;
    private randomUtils: RandomUtils;
    private waitUtils: WaitUtils;
    private domCoordinateQueue: DOMCoordinateQueue;
    private botSettingsManager: BotSettingsManager;
    private logger: Logger;


    constructor() {
        container.register("middleHTMLElementDOMCoordinateStrategy", {useClass: MiddleHTMLElementDOMCoordinateStrategy});
        container.register("randomHTMLElementDOMCoordinateStrategy", {useClass: RandomHTMLElementDOMCoordinateStrategy});
        this.botSettingsManager = container.resolve(BotSettingsManager);

        this.mouse = container.resolve(MouseSimulator);
        this.helper = container.resolve(HTMLElementHelper);
        this.pathFinder = container.resolve(LinearDOMCoordinatePathFinderStrategy);
        this.waitUtils = container.resolve(WaitUtils);
        this.randomUtils = container.resolve(RandomUtils);
        this.domCoordinateQueue = container.resolve(DOMCoordinateQueue);
        this.logger = container.resolve(Logger);

    }

    public getHTMLElementByQuerySelector(querySelector: string): HTMLElement | null {
        return document.querySelector(querySelector);
    }

    public async moveFromCurrentCoordinateToAnotherCoordinateAndClick(endCoordinate: DOMCoordinate) {
        const currentCoordinate: DOMCoordinate = (this.mouse.getFakeCursorDOMCoordinate() as DOMCoordinate);
        await this.moveFromStartCoordinateToEndCoordinateAndClick(currentCoordinate, endCoordinate);
    }

    public async moveFromCurrentCoordinateToAnotherCoordinate(endCoordinate: DOMCoordinate) {
        const currentCoordinate: DOMCoordinate = (this.mouse.getFakeCursorDOMCoordinate() as DOMCoordinate);
        await this.moveFromStartCoordinateToEndCoordinate(currentCoordinate, endCoordinate);
    }

    public async moveToElementByQuerySelectorAndClick(querySelector: string) {
        const elementDOMCoordinate: DOMCoordinate | null = 
            this.helper.getDOMCoordinateByQuerySelector(querySelector);

        await this.moveFromCurrentCoordinateToAnotherCoordinateAndClick(
            elementDOMCoordinate as DOMCoordinate
        );
    }

    public async moveToElementByQuerySelectorInRadius(querySelector: string, radius: number) {
        const elementDOMCoordinate: DOMCoordinate | null = 
            this.helper.getDOMCoordinateByQuerySelector(querySelector);

        if(elementDOMCoordinate) {
            elementDOMCoordinate.x += this.randomUtils.intBetween(-radius, radius);
            elementDOMCoordinate.y += this.randomUtils.intBetween(-radius, radius);
        }

        this.logger.info(`Moving to random point in radius...`);
        await this.moveFromCurrentCoordinateToAnotherCoordinate(
            elementDOMCoordinate as DOMCoordinate
        );
    }

    public async moveToElementByQueryAllIndexSelectorAndClick(querySelector: string, index: number) {
        const elementDOMCoordinate: DOMCoordinate | null = 
            this.helper.getDOMCoordinateElementByQuerySelectorAllIndex(querySelector, index);

        await this.moveFromCurrentCoordinateToAnotherCoordinateAndClick(
            elementDOMCoordinate as DOMCoordinate
        );
    }

    public async moveFromCurrentCoordinateToRandomCoordinate() {
        const endingPoint: DOMCoordinate | null = {
            x: this.randomUtils.intBetween(0, window.innerWidth),
            y: this.randomUtils.intBetween(0, window.innerHeight),
        }

        this.logger.info(`Moving to random point...`);
        await this.moveFromCurrentCoordinateToAnotherCoordinate(endingPoint);
    }


    public async moveFromStartCoordinateToEndCoordinate(
        startCoordinate: DOMCoordinate,
        endCoordinate: DOMCoordinate 
    ) {
        this.domCoordinateQueue.setQueue(
            this.pathFinder.findPath(startCoordinate, endCoordinate));

        const numberOfCoordinatesToSkip: number = 
            this.botSettingsManager.getBotSettings().mouse.numberOfCoordinatesToSkip;

        while(this.domCoordinateQueue.getCounter() >= 0) {
            const nextCoordinate: DOMCoordinate = this.domCoordinateQueue.popFirst();
            
            if(this.domCoordinateQueue.getCounter() % numberOfCoordinatesToSkip === 0) {
                this.mouse.move(nextCoordinate);
                await this.waitUtils.waitMilliSeconds(1);
            }
        }
    }

    public async moveFromStartCoordinateToEndCoordinateAndClick(
        startCoordinate: DOMCoordinate,
        endCoordinate: DOMCoordinate 
    ) {
        this.domCoordinateQueue.setQueue(
            this.pathFinder.findPath(startCoordinate, endCoordinate));

        const numberOfCoordinatesToSkip: number = 
            this.botSettingsManager.getBotSettings().mouse.numberOfCoordinatesToSkip;

        while(this.domCoordinateQueue.getCounter() >= 0) {
            const nextCoordinate: DOMCoordinate = this.domCoordinateQueue.popFirst();
            
            // If input logging of the crims  is enabled
            // it is needed to skip some coordinate (because it consume resources the logging)
            // (without input logging it is needed only to wait millis)
            if(this.domCoordinateQueue.getCounter() % numberOfCoordinatesToSkip === 0) {
                this.mouse.move(nextCoordinate);
                await this.waitUtils.waitMilliSeconds(1);
            }

            if(this.domCoordinateQueue.isLastCoordinate()) {
                this.mouse.click();
            }
        }
    }
}