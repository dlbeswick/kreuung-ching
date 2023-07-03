System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function errorHandler(message, source, lineno, colno, error, showAlert = true) {
        if (showAlert)
            alert(message);
        document.getElementById("error").style.display = "block";
        document.getElementById("error").innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source;
        return true;
    }
    exports_1("errorHandler", errorHandler);
    return {
        setters: [],
        execute: function () {
        }
    };
});
