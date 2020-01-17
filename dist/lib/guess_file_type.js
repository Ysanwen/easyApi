"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regex_config_1 = require("../regex_config");
function getSuffix(filename) {
    var testMatch = filename.match(/\.[a-zA-Z]+$/g);
    return testMatch ? testMatch[0] : '';
}
function guessFileType(filename) {
    var suffix = getSuffix(filename);
    var defaultFileType = 'javascript';
    for (var key in regex_config_1.default) {
        if (regex_config_1.default[key].fileSuffix.indexOf(suffix) >= 0) {
            defaultFileType = key;
            break;
        }
    }
    return defaultFileType;
}
exports.default = guessFileType;
