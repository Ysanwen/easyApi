"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiEnd = exports.apiStart = exports.parseLine = exports.trimLine = void 0;
var regex_config_1 = require("../regex_config");
var EffectiveTags = require("./parse_tool/tag_info");
var symbol = '@';
var matchTag = new RegExp("^" + symbol + "[A-Z]\\S+\\s+");
var effectiveKeys = Object.keys(EffectiveTags);
function trimLine(line, fileType) {
    line = line.replace(/(^\s*)|(\s*$)/g, '');
    line = line.replace(regex_config_1.default[fileType].prefixRegex, '');
    line = line.replace(regex_config_1.default[fileType].suffixRegex, '');
    return line;
}
exports.trimLine = trimLine;
function parseLine(line) {
    if (line.indexOf(symbol) >= 0) {
        var testMatch = line.match(matchTag);
        if (testMatch) {
            var replaceReg = new RegExp("(" + symbol + ")|\\s", 'g');
            var key = testMatch[0].replace(replaceReg, '');
            if (effectiveKeys.indexOf(key) >= 0) {
                var content = line.replace(testMatch[0], '');
                content = content.replace(/(^\s*)|(\s*$)/g, '');
                var tagInfo = new EffectiveTags[key](content);
                return { err: null, content: '', tagInfo: tagInfo };
            }
            else {
                return { err: new Error("unknow tag: \"" + symbol + key + "\""), content: '', tagInfo: null };
            }
        }
        else {
            return { err: new Error("can not parse line: \"" + line + "\""), content: '', tagInfo: null };
        }
    }
    else {
        return { err: null, content: line, tagInfo: null };
    }
}
exports.parseLine = parseLine;
function apiStart(line) {
    var reg = new RegExp(symbol + "ApiStart");
    return reg.test(line);
}
exports.apiStart = apiStart;
function apiEnd(line) {
    var reg = new RegExp(symbol + "ApiEnd");
    return reg.test(line);
}
exports.apiEnd = apiEnd;
