"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs-extra");
var extract_block_1 = require("./lib/extract_block");
var block_info_1 = require("./lib/block_info");
var ParseFile = (function () {
    function ParseFile(config) {
        var _inputPath = config._inputPath || [];
        var fileArray = [];
        for (var _i = 0, _inputPath_1 = _inputPath; _i < _inputPath_1.length; _i++) {
            var pathStr = _inputPath_1[_i];
            fileArray = fileArray.concat(this.parsePath(pathStr));
        }
        this.inputFiles = fileArray;
        this.outputPath = config.outputPath || path.resolve(process.cwd(), './api_doc');
    }
    ParseFile.prototype.parsePath = function (pathStr) {
        var _this = this;
        var fileArray = [];
        var status = fs.lstatSync(pathStr);
        if (status.isDirectory()) {
            var pathList = fs.readdirSync(pathStr);
            pathList = pathList.map(function (subPath) {
                var newPath = path.resolve(pathStr, subPath);
                fileArray = fileArray.concat(_this.parsePath(newPath));
                return newPath;
            });
        }
        else if (status.isFile()) {
            fileArray.push(pathStr);
        }
        return fileArray;
    };
    ParseFile.prototype.parseAllFile = function () {
        var _this = this;
        var total = this.inputFiles.length;
        var start = 0;
        var _loop_1 = function (file) {
            console.log("start parse file: \"" + file + "\"");
            var extract_block = new extract_block_1.default(file);
            extract_block.doExtract(function () {
                start += 1;
                console.log("parse file: \"" + file + "\" success!");
                if (start >= total) {
                    _this.allDone();
                }
            });
        };
        for (var _i = 0, _a = this.inputFiles; _i < _a.length; _i++) {
            var file = _a[_i];
            _loop_1(file);
        }
    };
    ParseFile.prototype.allDone = function () {
        block_info_1.writeJson();
    };
    return ParseFile;
}());
exports.default = ParseFile;
