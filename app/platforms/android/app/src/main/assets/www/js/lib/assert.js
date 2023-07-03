System.register(["./error_handler.js"], function (exports_1, context_1) {
    "use strict";
    var error_handler_js_1;
    var __moduleName = context_1 && context_1.id;
    function assert(test, message = 'Assertion failed', ...args) {
        if (!test) {
            message = [message, ...args.map(JSON.stringify)].join(", ");
            error_handler_js_1.errorHandler(message, undefined, undefined, undefined, undefined, false);
            throw new Error(message);
        }
    }
    exports_1("assert", assert);
    function assertf(test, message, ...args) {
        if (!test()) {
            message = message !== null && message !== void 0 ? message : test.toString() + args.map(JSON.stringify).join(", ");
            error_handler_js_1.errorHandler(message, undefined, undefined, undefined, undefined, false);
            throw new Error(message);
        }
    }
    exports_1("assertf", assertf);
    return {
        setters: [
            function (error_handler_js_1_1) {
                error_handler_js_1 = error_handler_js_1_1;
            }
        ],
        execute: function () {
        }
    };
});
