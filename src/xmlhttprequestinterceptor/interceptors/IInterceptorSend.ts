import { RequestDataWrapper } from "../RequestDataWrapper";

export interface IInterceptorSend {
    before(xmlHttpRequest: XMLHttpRequest, requestData: RequestDataWrapper): void;
}
