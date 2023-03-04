import { container, singleton } from "tsyringe";
import { CustomInterceptorOpen } from "../xmlhttprequestinterceptor/interceptors/CustomInterceptorOpen";
import { CustomInterceptorSend } from "../xmlhttprequestinterceptor/interceptors/CustomInterceptorSend";
import { XMLHttpRequestProxy } from "../xmlhttprequestinterceptor/XMLHttpRequestProxy";
import { IBotWorkflow } from "./workflow/commons/IBotWorkflow";
import { SingleRobberyBotWorkflow } from "./workflow/SingleRobberyBotWorkflow";
import { DetoxBotWorkflow } from "./workflow/commons/DetoxBotWorkflow";
import { GangRobberyBotWorkflow } from "./workflow/GangRobberyBotWorkflow";
import { RechargeBotWorkflow } from "./workflow/commons/RechargeBotWorkflow";
import { DoNothingBotWorkflow } from "./workflow/DoNothingBotWorkflow";
import { SingleAssaultBotWorkflow } from "./workflow/SingleAssaultBotWorkflow";
import { TestBotWorkflow } from "./workflow/TestBotWorkflow";


@singleton()
export class Bot {

    private proxy: XMLHttpRequestProxy;
    private workflowToExecute: IBotWorkflow;

    private whatYouWantoToDo(): string | null {
        const message = `
        What do you want to do?
        
        1) Single Robbery
        2) Gang Robbery
        3) Single Assault
        4) Recharge only
        5) Detox only
        x) Exit

        `;
        return prompt(message);
    }

    constructor() {

        const userInput = this.whatYouWantoToDo();
        switch (userInput) {
            case "1":
                this.workflowToExecute = container.resolve(SingleRobberyBotWorkflow);
                break;
            case "2":
                this.workflowToExecute = container.resolve(GangRobberyBotWorkflow);
                break;
            case "3":
                this.workflowToExecute = container.resolve(SingleAssaultBotWorkflow);
                break;
            case "4":
                this.workflowToExecute = container.resolve(RechargeBotWorkflow);
                break;
            case "5":
                this.workflowToExecute = container.resolve(DetoxBotWorkflow);
                break;
            case "t":
                this.workflowToExecute = container.resolve(TestBotWorkflow);
                break;
            default:
                this.workflowToExecute = container.resolve(DoNothingBotWorkflow);
                break;
        }

        this.proxy = new XMLHttpRequestProxy(
            new CustomInterceptorOpen(), 
            new CustomInterceptorSend()
        );

        this.proxy.initialize();
    }

    public async start() {
        await this.workflowToExecute.execute();
    }


}