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
import { WindDOMCoordinatePathFinderStrategy } from "../pathfinder/WindDOMCoordinatePathFinderStrategy";

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

    private keyboardKeyForPauseResumeBot: string;

    constructor() {
        container.register("middleHTMLElementDOMCoordinateStrategy", {useClass: MiddleHTMLElementDOMCoordinateStrategy});
        container.register("randomHTMLElementDOMCoordinateStrategy", {useClass: RandomHTMLElementDOMCoordinateStrategy});
        this.botSettingsManager = container.resolve(BotSettingsManager);

        this.mouse = container.resolve(MouseSimulator);
        this.helper = container.resolve(HTMLElementHelper);
        this.waitUtils = container.resolve(WaitUtils);
        this.randomUtils = container.resolve(RandomUtils);
        this.domCoordinateQueue = container.resolve(DOMCoordinateQueue);
        this.logger = container.resolve(Logger);
        this.pathFinder = container.resolve(LinearDOMCoordinatePathFinderStrategy);

        this.setPathFinder();

        this.keyboardKeyForPauseResumeBot = 
            this.botSettingsManager
                .getBotSettings()
                .general
                .pauseResume
                .keyboardKeyForPauseResumeBot;
    }

    private setPathFinder(): void {
        if(this.botSettingsManager.getBotSettings().coordinatePathStrategy.useLinearPathStrategy) {
            this.pathFinder = container.resolve(LinearDOMCoordinatePathFinderStrategy);

        }
        else if(this.botSettingsManager.getBotSettings().coordinatePathStrategy.useWindPathStrategy) {
            this.pathFinder = container.resolve(WindDOMCoordinatePathFinderStrategy);
        }
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

    public async moveFromCurrentCoordinateToRandomCoordinateInsideHTMLElementAndClick(htmlElement: HTMLElement) {
        const htmlElementDOMRect: DOMRect = htmlElement.getBoundingClientRect();

        const htmlElementTop: number = htmlElementDOMRect.top + 5;
        const htmlElementRight: number = htmlElementDOMRect.right - 5;
        const htmlElementBottom: number = htmlElementDOMRect.bottom - 5;
        const htmlElementLeft: number = htmlElementDOMRect.left + 5;

        const htmlElementRandomPointX: number = 
            this.randomUtils.intBetween(htmlElementLeft, htmlElementRight);

        const htmlElementRandomPointY: number = 
            this.randomUtils.intBetween(htmlElementTop, htmlElementBottom);

        // Return the point of HTMLElement with the respective offset
        const endingPoint: DOMCoordinate = {
            x: htmlElementRandomPointX,
            y: htmlElementRandomPointY,
        };

        this.logger.info(`Moving to random point...`);
        await this.moveFromCurrentCoordinateToAnotherCoordinateAndClick(endingPoint);
    }


    public async moveFromStartCoordinateToEndCoordinate(
        startCoordinate: DOMCoordinate,
        endCoordinate: DOMCoordinate 
    ) {
        this.domCoordinateQueue.setQueue(
            this.pathFinder.findPath(startCoordinate, endCoordinate)
        );
        const numberOfCoordinatesToSkip: number = 
            this.botSettingsManager.getBotSettings().mouse.numberOfCoordinatesToSkip;

        while (this.domCoordinateQueue.getCounter() >= 0) {

            if (this.domCoordinateQueue.getIsBlocked() === true) {
                console.log(`Bot paused. Press the same combination keyboard shortcut to resume the execution`);
                while (this.domCoordinateQueue.getIsBlocked() === true) {
                    await this.waitUtils.waitMilliSeconds(250);
                }
            }

            const nextCoordinate: DOMCoordinate = this.domCoordinateQueue.popFirst();

            // If input logging of the crims  is enabled
            // it is needed to skip some coordinate (because it consume resources the logging)
            // (without input logging it is needed only to wait millis)
            if (this.domCoordinateQueue.getCounter() % numberOfCoordinatesToSkip === 0) {
                let timeToWait: number = 1;
                if(nextCoordinate.millisecondsToWait) {
                    timeToWait = nextCoordinate.millisecondsToWait;
                }
                this.mouse.move(nextCoordinate);
                await this.waitUtils.waitMilliSeconds(timeToWait);
            }
        }
    }

    public async moveFromStartCoordinateToEndCoordinateAndClick(
        startCoordinate: DOMCoordinate,
        endCoordinate: DOMCoordinate 
    ) {
        await this.moveFromStartCoordinateToEndCoordinate(startCoordinate, endCoordinate);

        if(this.domCoordinateQueue.isLastCoordinate()) {
            this.mouse.click();
        }
    }
}