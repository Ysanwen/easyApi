"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function splitStr(str) {
    var result = ['', ''];
    var isMatch = str.match(/^\S+\s*/);
    if (isMatch) {
        result[0] = isMatch[0].replace(/\s/g, '');
        result[1] = str.replace(isMatch[0], '');
    }
    return result;
}
exports.default = splitStr;
