import { IInterceptorOpen } from "./interceptors/IInterceptorOpen";
import { IInterceptorSend } from "./interceptors/IInterceptorSend";
import { RequestDataWrapper } from "./RequestDataWrapper";

/**
 * This class acts as a proxy of the original XMLHttpRequest object.
 */
export class XMLHttpRequestProxy {

    private interceptorOpen: IInterceptorOpen;
    private interceptorSend: IInterceptorSend;

    private originalXMLHttpRequestOpen: any;
    private originalXMLHttpRequestSend: any;

    /**
     * Build an XMLHttpRequest proxy providing the custom interceptors:
     * 
     * @param interceptorOpen - The interceptor object for XMLHttpRequest.prototype.open function
     * @param interceptorSend - The interceptor object for XMLHttpRequest.prototype.send function
     * 
     */

    constructor(interceptorOpen: IInterceptorOpen, interceptorSend: IInterceptorSend) {
        this.interceptorOpen = interceptorOpen;
        this.interceptorSend = interceptorSend;

        this.originalXMLHttpRequestOpen = window.XMLHttpRequest.prototype.open;
        this.originalXMLHttpRequestSend = window.XMLHttpRequest.prototype.send;
    }

    /**
     * This method override the XMLHttpRequest.prototype.send by adding the IInterceptorSend methods calls.
     */
    private redefineXMLHttpRequestSend() {

        // Reference to the "this" of the XMLHttpRequestProxy
        const self = this;

        XMLHttpRequest.prototype.send = function(requestData) {

            const requestDataWrapper: RequestDataWrapper = {data: requestData};

            self.interceptorSend.before(this, requestDataWrapper);

            // The type of the args passed to the XMLHttpRequest.prototype.send function
            // must be always of type string.
            // So if needed, convert object to string before send
            if(typeof requestDataWrapper.data === 'object') {
                requestData = JSON.stringify(requestDataWrapper.data);
            }
            else {
                requestData = requestDataWrapper.data;
            }

            self.originalXMLHttpRequestSend.call(this, requestData);
        };
    }

    private redefineXMLHttpRequestOpen() {

        // Reference to the "this" of the XMLHttpRequestProxy
        const self = this;

        XMLHttpRequest.prototype.open = function(): void {

            const argumenntsOfOpenFunction = arguments;

            this.addEventListener('abort', function() {
                self.interceptorOpen.abort(this, argumenntsOfOpenFunction);
            });

            this.addEventListener('error', function() {
                self.interceptorOpen.error(this, argumenntsOfOpenFunction);
            });

            this.addEventListener('load', function() {
                self.interceptorOpen.load(this, argumenntsOfOpenFunction);
            });
            
            this.addEventListener('loadend', function() {
                self.interceptorOpen.loadEnd(this, argumenntsOfOpenFunction);
            });

            this.addEventListener('loadstart', function() {
                self.interceptorOpen.loadStart(this, argumenntsOfOpenFunction);
            });

            this.addEventListener('progress', function() {
                self.interceptorOpen.progress(this, argumenntsOfOpenFunction);
            });

            this.addEventListener('readystatechange', function() {
                self.interceptorOpen.readyStateChange(this, argumenntsOfOpenFunction);
            });

            this.addEventListener('timeout', function() {
                self.interceptorOpen.timeout(this, argumenntsOfOpenFunction);
            });

            return self.originalXMLHttpRequestOpen.apply(this, argumenntsOfOpenFunction);
        }
    }

    /**
     * Initialize the class by overriding the functions:
     * 
     * - XMLHttpRequest.prototype.send
     * - XMLHttpRequest.prototype.open
     * 
     * with the intercepotrs provided in the constructor
     * 
     */
    public initialize() {
        this.redefineXMLHttpRequestOpen();
        this.redefineXMLHttpRequestSend();
    }

    /**
     * Set a new interceptor for the XMLHttpRequest.prototype.open function
     * 
     * @param newInterceptorOpen - The new interceptor object.
     * It must be impments the {@link IInterceptorOpen} interface
     */
    public setInterceptorOpen(newInterceptorOpen: IInterceptorOpen) {
        this.interceptorOpen = newInterceptorOpen;
    }

    /**
     * Set a new interceptor for the XMLHttpRequest.prototype.send function
     * 
     * @param newInterceptorSend - The new interceptor object
     * It must be impments the {@link IInterceptorSend} interface 
     */
    public setInterceptorSend(newInterceptorSend: IInterceptorSend) {
        this.interceptorSend = newInterceptorSend;
    }
}