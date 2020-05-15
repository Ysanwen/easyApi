"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regexConfig = {
    "javascript": {
        prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
        suffixRegex: /\s*\*\/\s*$/g,
        fileSuffix: ['.js', '.ts', '.javascript'],
    },
    "java": {
        prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
        suffixRegex: /\s*\*\/\s*$/g,
        fileSuffix: ['.java'],
    },
    "c": {
        prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
        suffixRegex: /\s*\*\/\s*$/g,
        fileSuffix: ['.c', '.cpp', '.cs'],
    },
    "php": {
        prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
        suffixRegex: /\s*\*\/\s*$/g,
        fileSuffix: ['.php'],
    },
    "swift": {
        prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
        suffixRegex: /\s*\*\/\s*$/g,
        fileSuffix: ['.swift'],
    },
    "go": {
        prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
        suffixRegex: /\s*\*\/\s*$/g,
        fileSuffix: ['.go'],
    },
    "python": {
        prefixRegex: /^#\s*|^\"{3}\s*|^\'{3}\s*/g,
        suffixRegex: /\"{3}\s*$|\'{3}\s*$/g,
        fileSuffix: ['.py'],
    }
};
exports.default = regexConfig;
