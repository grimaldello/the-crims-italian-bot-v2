import { RequestDataWrapper } from "../RequestDataWrapper";
import { IInterceptorSend } from "./IInterceptorSend";

export class CustomInterceptorSend implements IInterceptorSend {
    before(xmlHttpRequest: XMLHttpRequest, requestData: RequestDataWrapper): void {}
}