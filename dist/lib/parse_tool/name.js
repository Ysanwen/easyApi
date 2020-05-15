"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
var split_str_1 = require("./split_str");
var Name = (function () {
    function Name(content) {
        this.name = 'Name';
        this.error = null;
        var splitArr = split_str_1.default(content);
        var name = splitArr[0];
        var description = splitArr[1];
        if (name) {
            this.key = name;
            this.description = description;
        }
        else {
            this.error = new Error("Name can not be empty");
        }
    }
    return Name;
}());
exports.Name = Name;
