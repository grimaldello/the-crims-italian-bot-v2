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
import { BotSettingsManager } from "./settings/BotSettingsManager";
import { AccountUnderInvestigationAuditorService } from "./AccountUnderInvestigationAuditorService";
import { WaitToBeKilledBotWorkflow } from "./workflow/WaitToBeKilledBotWorkflow";

@singleton()
export class Bot {

    private proxy: XMLHttpRequestProxy;
    private workflowToExecute: IBotWorkflow;
    private botSettingsManager: BotSettingsManager;
    private accountUnderInvestigationAuditorService: AccountUnderInvestigationAuditorService;

    private whatYouWantToDo(): string | null {
        const message = `
        What do you want to do?
        
        1) Single Robbery
        2) Gang Robbery
        3) Single Assault
        4) Recharge only
        5) Detox only
        6) Wait to be killed
        x) Exit

        `;
        return prompt(message);
    }

    constructor() {
        this.botSettingsManager = container.resolve(BotSettingsManager);
        this.accountUnderInvestigationAuditorService = 
            container.resolve(AccountUnderInvestigationAuditorService);

        this.proxy = new XMLHttpRequestProxy(
            new CustomInterceptorOpen(),
            new CustomInterceptorSend()
        );
        this.proxy.initialize();

        this.removeDOMElementsByQuerySelector();

        const userInput = this.whatYouWantToDo();
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
            case "6":
                this.workflowToExecute = container.resolve(WaitToBeKilledBotWorkflow);
                break;
            case "t":
                this.workflowToExecute = container.resolve(TestBotWorkflow);
                break;
            default:
                this.workflowToExecute = container.resolve(DoNothingBotWorkflow);
                break;
        }
    }

    private removeDOMElementsByQuerySelector(): void {
        this.botSettingsManager
            .getBotSettings()
            .general
            .querySelectorsDOMElementsToRemove
            .forEach(selector => {
                (document.querySelector(selector) as HTMLElement).remove();
            });
    }

    public async start() {
        this.accountUnderInvestigationAuditorService.startCheck();
        await this.workflowToExecute.execute();
    }


}