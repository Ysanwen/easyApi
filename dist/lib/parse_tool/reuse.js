"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var split_str_1 = require("./split_str");
var Reuse = (function () {
    function Reuse(content) {
        this.name = "Reuse";
        this.error = null;
        var splitArr = split_str_1.default(content);
        splitArr[0] && (this.key = splitArr[0]);
    }
    return Reuse;
}());
exports.Reuse = Reuse;
