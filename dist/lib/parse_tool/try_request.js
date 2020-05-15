"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryRequest = void 0;
var TryRequest = (function () {
    function TryRequest(content) {
        this.name = 'TryRequest';
        this.error = null;
        this.description = content.replace(/^\s+|\s+$/g, '');
        if (this.description.indexOf('false') >= 0) {
            this.tryRequest = false;
        }
        else {
            this.tryRequest = true;
        }
    }
    return TryRequest;
}());
exports.TryRequest = TryRequest;
