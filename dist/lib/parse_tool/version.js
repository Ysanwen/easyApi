"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var split_str_1 = require("./split_str");
var Version = (function () {
    function Version(content) {
        this.name = 'Version';
        var matchVersion = split_str_1.default(content);
        this.key = matchVersion ? matchVersion[0] : '';
    }
    return Version;
}());
exports.Version = Version;
