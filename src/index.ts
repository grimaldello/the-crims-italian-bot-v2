import "reflect-metadata";
import { container } from "tsyringe";
import { Bot } from "./bot/Bot";


(async ()=>{
    const bot: Bot = container.resolve(Bot);
    await bot.start();
})();
