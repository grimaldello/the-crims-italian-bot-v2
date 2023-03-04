export interface IInterceptorOpen {
    abort(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    error(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    load(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    loadEnd(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    loadStart(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    progress(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    readyStateChange(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
    timeout(xmlHttpRequest: XMLHttpRequest, args: IArguments): void;
}