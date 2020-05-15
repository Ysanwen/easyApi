"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var readline = require("readline");
var color_log_1 = require("../color_log");
var guess_file_type_1 = require("./guess_file_type");
var handleTags = require("./handle_tags");
var block_info_1 = require("./block_info");
var regex_config_1 = require("../regex_config");
var ExtractBlock = (function () {
    function ExtractBlock(inputFile) {
        this.blockBegin = false;
        this.cacheLine = [];
        this.lineNumber = 0;
        this.annotationStart = false;
        this.inputFile = inputFile;
        var splitFileName = inputFile.split('/');
        this.fileName = splitFileName[splitFileName.length - 1] || '';
        this.fileType = guess_file_type_1.default(inputFile);
    }
    ExtractBlock.prototype.doExtract = function (callback) {
        var _this = this;
        var rl = readline.createInterface({
            input: fs.createReadStream(this.inputFile),
            crlfDelay: Infinity
        });
        rl.on('line', function (line) {
            _this.lineNumber += 1;
            _this.getEffectiveAnnotation(line);
        });
        rl.on('close', function () {
            callback();
        });
    };
    ExtractBlock.prototype.getEffectiveAnnotation = function (line) {
        var fileType = this.fileType;
        line = line.replace(/^\s*|\s*$/g, '');
        var matchStart = line.match(regex_config_1.default[fileType].prefixRegex);
        var matchEnd = line.match(regex_config_1.default[fileType].suffixRegex);
        if (fileType !== 'python') {
            (matchStart || matchEnd) && this.getLine(line);
        }
        else {
            if (line.indexOf('#') === 0) {
                this.getLine(line);
            }
            else {
                if (matchStart && !matchEnd) {
                    this.annotationStart = true;
                    this.getLine(line);
                }
                else if (!matchStart && matchEnd) {
                    this.annotationStart = false;
                    this.getLine(line);
                }
                else if (matchStart && matchEnd) {
                    if (line.replace(matchStart[0], '').length === 0) {
                        this.annotationStart = !this.annotationStart;
                    }
                    this.getLine(line);
                }
                else {
                    this.annotationStart && this.getLine(line);
                }
            }
        }
    };
    ExtractBlock.prototype.getLine = function (line) {
        if (handleTags.apiStart(line)) {
            this.blockBegin = true;
            this.cacheLine = [];
        }
        else if (handleTags.apiEnd(line)) {
            this.cacheLine && this.cacheLine.length > 0 && this.parseBlock();
            this.blockBegin = false;
            this.cacheLine = [];
        }
        else if (this.blockBegin) {
            line = handleTags.trimLine(line, this.fileType);
            if (line) {
                var lineInfo = {
                    content: line,
                    lineNumber: this.lineNumber
                };
                this.cacheLine.push(lineInfo);
            }
        }
    };
    ExtractBlock.prototype.parseBlock = function () {
        var infoArray = [];
        var currentTagInfo = null;
        for (var _i = 0, _a = this.cacheLine; _i < _a.length; _i++) {
            var lineInfo = _a[_i];
            var parseInfo = handleTags.parseLine(lineInfo.content);
            if (parseInfo.err) {
                color_log_1.errorLog(parseInfo.err.message + " at line number " + lineInfo.lineNumber + " of " + this.inputFile);
                currentTagInfo = null;
            }
            else {
                if (parseInfo.tagInfo) {
                    if (parseInfo.tagInfo.error) {
                        var errMsg = parseInfo.tagInfo.error.message;
                        color_log_1.errorLog(errMsg + " at line number " + lineInfo.lineNumber + " of " + this.inputFile);
                        currentTagInfo = null;
                    }
                    else {
                        infoArray.push(parseInfo.tagInfo);
                        currentTagInfo = parseInfo.tagInfo;
                    }
                }
                else {
                    var content = '\r\n' + parseInfo.content;
                    currentTagInfo && currentTagInfo.appendDescription && currentTagInfo.appendDescription(content);
                }
            }
        }
        block_info_1.getBlockInfo(infoArray);
    };
    return ExtractBlock;
}());
exports.default = ExtractBlock;
