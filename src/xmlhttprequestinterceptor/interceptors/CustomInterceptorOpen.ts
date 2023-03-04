import { IInterceptorOpen } from "./IInterceptorOpen";
import { BotEvents } from "../../bot/BotEvents";

export class CustomInterceptorOpen implements IInterceptorOpen {

    private allowedURLStringsList: string[] = [
        "www.thecrims.com"
    ];

    private notAllowedURLStringsList: string[] = [
        "/api/v1/state",
        "/static/js/languages"
    ];

    private checkIsAllowed(url: string) {
        
        let isAllowed = false;
        let isInNotAllowed = false;

        for(const allowedUrl of this.allowedURLStringsList) {
            if(url.includes(allowedUrl)) {
                isAllowed = true;
                break;
            }
        }

        for(const notAllowedUrl of this.notAllowedURLStringsList) {
            if(url.includes(notAllowedUrl)) {
                isInNotAllowed = true;
                break;
            }
        }

        return isAllowed && !isInNotAllowed;
    }

    private parseResponse(responseText: string): any {
        return JSON.parse(responseText);
    }

    private makeCustomEventInit(responseText: string): CustomEventInit<any> {
        return {
            detail: this.parseResponse(responseText)
        };
    }

    private makeCustomEvent(
        eventName: string, 
        customEventInit: CustomEventInit<any>): CustomEvent {
            return new CustomEvent(eventName, customEventInit);
    }

    private dispatchEvent(eventName: string, responseText: string): void {
        const customEventInit: CustomEventInit<any> = this.makeCustomEventInit(responseText);
        const customEvent: CustomEvent = this.makeCustomEvent(eventName, customEventInit);
        window.dispatchEvent(customEvent);
    }

    abort(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {}
    error(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {}
    load(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {
        const responseURL = xmlHttpRequest.responseURL;
        
        if(!this.checkIsAllowed(responseURL)) { return; }
        
        // console.log(">>> open - load");
    }

    progress(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {}
    readyStateChange(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {}
    timeout(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {}

    loadEnd(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {
        const responseURL = xmlHttpRequest.responseURL;
        const responseStatus = xmlHttpRequest.status;

        if(!this.checkIsAllowed(responseURL) || responseStatus != 200) { return; }
        
        // console.log(">>> open - loadEnd");

        if(responseURL.endsWith("api/v1/nightclubs")) {
            this.dispatchEvent(
                BotEvents.NIGHTCLUBS_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/nightclub")) {
            this.dispatchEvent(
                BotEvents.ENTER_NIGHTCLUB_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/nightclub/drug") || 
                responseURL.endsWith("api/v1/nightclub/hooker")) {
            this.dispatchEvent(
                BotEvents.BUY_DRUG_OR_HOOKER_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/nightclub/exit")) {
            this.dispatchEvent(
                BotEvents.EXIT_NIGHTCLUB_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/rob")) {
            this.dispatchEvent(
                BotEvents.ROB_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/robberies")) {
            this.dispatchEvent(
                BotEvents.ROBBERIES_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/gangrobbery/accept")) {
            this.dispatchEvent(
                BotEvents.ACCEPT_GANG_ROBBERY_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/gangrobbery/execute")) {
            this.dispatchEvent(
                BotEvents.EXECUTE_GANG_ROBBERY_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/hookers")) {
            this.dispatchEvent(
                BotEvents.HOOKERS_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/hospital")) {
            this.dispatchEvent(
                BotEvents.HOSPITAL_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/hospital/detox")) {
            this.dispatchEvent(
                BotEvents.DETOX_DONE, 
                xmlHttpRequest.responseText
            );
        }
        else if(responseURL.endsWith("api/v1/nightclub/visitors")) {
            this.dispatchEvent(
                BotEvents.VISITORS_DONE, 
                xmlHttpRequest.responseText
            );
        }
        
        
        
    }

    loadStart(xmlHttpRequest: XMLHttpRequest, args: IArguments): void {
        const responseURL = xmlHttpRequest.responseURL;
        
        if(!this.checkIsAllowed(responseURL)) { return; }
        
    }

    
}