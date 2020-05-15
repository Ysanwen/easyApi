"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var split_str_1 = require("./split_str");
var Model = (function () {
    function Model(content) {
        this.name = "Model";
        this.error = null;
        var splitArr = split_str_1.default(content);
        var name = splitArr[0];
        var description = splitArr[1];
        if (name) {
            this.key = name;
            this.description = description;
        }
        else {
            this.error = new Error("Model name can not be empty");
        }
    }
    return Model;
}());
exports.Model = Model;
