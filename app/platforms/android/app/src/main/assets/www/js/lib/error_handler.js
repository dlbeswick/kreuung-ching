System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function errorHandler(message, source, lineno, colno, error, showAlert = true) {
        if (showAlert)
            alert(message);
        const errorEl = document.getElementById("error");
        if (errorEl) {
            errorEl.style.display = "block";
            errorEl.innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source;
        }
        return true;
    }
    exports_1("errorHandler", errorHandler);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3RzL2xpYi9lcnJvcl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBLFNBQWdCLFlBQVksQ0FBQyxPQUFZLEVBQUUsTUFBWSxFQUFFLE1BQVksRUFBRSxLQUFXLEVBQUUsS0FBVyxFQUFFLFNBQVMsR0FBQyxJQUFJO1FBQzdHLElBQUksU0FBUztZQUNYLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVoQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRWhELElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1lBQy9CLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxHQUFHLE9BQU8sR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUE7U0FDN0U7UUFFRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZXJyb3JIYW5kbGVyKG1lc3NhZ2U6IGFueSwgc291cmNlPzogYW55LCBsaW5lbm8/OiBhbnksIGNvbG5vPzogYW55LCBlcnJvcj86IGFueSwgc2hvd0FsZXJ0PXRydWUpIHtcbiAgaWYgKHNob3dBbGVydClcbiAgICBhbGVydChtZXNzYWdlKVxuXG4gIGNvbnN0IGVycm9yRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpXG5cbiAgaWYgKGVycm9yRWwpIHtcbiAgICBlcnJvckVsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICBlcnJvckVsLmlubmVySFRNTCA9IG1lc3NhZ2UgKyBcIjxici8+XCIgKyBcIkxpbmU6IFwiICsgbGluZW5vICsgXCI8YnIvPlwiICsgc291cmNlXG4gIH1cbiAgXG4gIHJldHVybiB0cnVlXG59XG4iXX0=