import { singleton } from "tsyringe";
import { IBotWorkflow } from "./commons/IBotWorkflow";

@singleton()
export class DoNothingBotWorkflow implements IBotWorkflow {
    async execute(): Promise<void> {
        alert(`
            Nothing will be performed.
        `);
    }
    
}