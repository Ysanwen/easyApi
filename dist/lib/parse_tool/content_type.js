"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var split_str_1 = require("./split_str");
var EffectiveContentType = ['application/x-www-form-urlencoded', 'multipart/form-data', 'application/json', 'text/plain'];
var ContentType = (function () {
    function ContentType(content) {
        this.name = 'ContentType';
        this.error = null;
        var splitArr = split_str_1.default(content);
        var key = splitArr[0];
        if (key) {
            key = key.toLocaleLowerCase();
            if (EffectiveContentType.indexOf(key) >= 0) {
                this.key = key;
            }
            else {
                this.error = new Error("the request content type: " + key + " is invalid");
            }
        }
        else {
            this.key = 'application/json';
        }
    }
    return ContentType;
}());
exports.ContentType = ContentType;
