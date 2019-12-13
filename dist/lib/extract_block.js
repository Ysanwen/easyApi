"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var readline = require("readline");
var guess_file_type_1 = require("./guess_file_type");
var handleTags = require("./handle_tags");
var block_info_1 = require("./block_info");
var ExtractBlock = (function () {
    function ExtractBlock(inputFile) {
        this.blockBegin = false;
        this.cacheLine = [];
        this.lineNumber = 0;
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
            _this.getLine(line);
        });
        rl.on('close', function () {
            callback();
        });
    };
    ExtractBlock.prototype.getLine = function (line) {
        if (handleTags.apiStart(line)) {
            this.blockBegin = true;
            this.cacheLine = [];
        }
        else if (handleTags.apiEnd(line)) {
            this.parseBlock();
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
                console.log(parseInfo.err.message + " at line number " + lineInfo.lineNumber + " of " + this.inputFile);
                currentTagInfo = null;
            }
            else {
                if (parseInfo.tagInfo) {
                    if (parseInfo.tagInfo.error) {
                        var errMsg = parseInfo.tagInfo.error.message;
                        console.log(errMsg + " at line number " + lineInfo.lineNumber + " of " + this.inputFile);
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
