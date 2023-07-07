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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdHMvbGliL2Fzc2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBRUEsU0FBZ0IsTUFBTSxDQUFDLElBQVEsRUFBRSxPQUFPLEdBQUMsa0JBQWtCLEVBQUUsR0FBRyxJQUFRO1FBQ3RFLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUMzRCwrQkFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDeEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN6QjtJQUNILENBQUM7O0lBRUQsU0FBZ0IsT0FBTyxDQUFDLElBQWMsRUFBRSxPQUFlLEVBQUUsR0FBRyxJQUFRO1FBQ2xFLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNYLE9BQU8sR0FBRyxPQUFPLGFBQVAsT0FBTyxjQUFQLE9BQU8sR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzFFLCtCQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN4RSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3pCO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVycm9ySGFuZGxlciB9IGZyb20gXCIuL2Vycm9yX2hhbmRsZXIuanNcIlxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0KHRlc3Q6YW55LCBtZXNzYWdlPSdBc3NlcnRpb24gZmFpbGVkJywgLi4uYXJnczphbnkpOiBhc3NlcnRzIHRlc3Qge1xuICBpZiAoIXRlc3QpIHtcbiAgICBtZXNzYWdlID0gW21lc3NhZ2UsIC4uLmFyZ3MubWFwKEpTT04uc3RyaW5naWZ5KV0uam9pbihcIiwgXCIpXG4gICAgZXJyb3JIYW5kbGVyKG1lc3NhZ2UsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpXG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydGYodGVzdDooKSA9PiBhbnksIG1lc3NhZ2U/OnN0cmluZywgLi4uYXJnczphbnkpOnZvaWQge1xuICBpZiAoIXRlc3QoKSkge1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlID8/IHRlc3QudG9TdHJpbmcoKSArIGFyZ3MubWFwKEpTT04uc3RyaW5naWZ5KS5qb2luKFwiLCBcIilcbiAgICBlcnJvckhhbmRsZXIobWVzc2FnZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSlcbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSlcbiAgfVxufVxuXG4iXX0=