"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    TryRequest.prototype.appendDescription = function (content) {
        this.description += content;
    };
    return TryRequest;
}());
exports.TryRequest = TryRequest;
