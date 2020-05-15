"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
var split_str_1 = require("./split_str");
var Group = (function () {
    function Group(content) {
        this.name = 'Group';
        this.error = null;
        var splitArr = split_str_1.default(content);
        this.key = splitArr[0] || 'default';
    }
    return Group;
}());
exports.Group = Group;
