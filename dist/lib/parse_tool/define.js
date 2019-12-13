"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var split_str_1 = require("./split_str");
var Define = (function () {
    function Define(content) {
        this.name = "Define";
        this.error = null;
        var splitArr = split_str_1.default(content);
        if (splitArr[0]) {
            this.key = splitArr[0];
        }
    }
    return Define;
}());
exports.Define = Define;
