"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regexConfig = {
    "javascript": {
        prefixRegex: /^[\/\*]*\s?/g,
        suffixRegex: /\s?\*+\/$/g,
        fileSuffix: 'js, ts, javascript',
    }
};
exports.default = regexConfig;
