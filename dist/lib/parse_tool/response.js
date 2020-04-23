"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var split_str_1 = require("./split_str");
var contentTypeReg = /(audio)|(application)|(video)|(image)|(text)|(font)\//;
var Response = (function () {
    function Response(content) {
        this.name = 'Response';
        this.valueType = '';
        this.error = null;
        var splitArr = split_str_1.default(content);
        var responseType = splitArr[0];
        var rest = '';
        if (responseType && contentTypeReg.test(responseType)) {
            this.responseType = responseType;
            rest = splitArr[1];
        }
        else {
            this.responseType = 'application/json';
            rest = content;
        }
        var restArr = split_str_1.default(rest);
        var description = '';
        if (/^\d+$/.test(restArr[0])) {
            this.responseCode = parseInt(restArr[0]);
            description = restArr[1].replace(/(^\s*)|(\s*$)/g, '');
        }
        else {
            description = rest.replace(/(^\s*)|(\s*$)/g, '');
        }
        var testMatch = description.match(/\{\s*\&.*?\}/g);
        if (testMatch) {
            var valueType = testMatch[0];
            this.description = description.replace(valueType, '');
            valueType = valueType.replace(/\{|\}|\s/g, '');
            this.valueType = this.extraRefReplaceKey(valueType);
        }
        else {
            this.description = description;
        }
    }
    Response.prototype.appendDescription = function (content) {
        this.description += content.replace(/(^\s*)|(\s*$)/g, '');
    };
    Response.prototype.extraRefReplaceKey = function (refString) {
        var valueType = '';
        var matchReplaceKey = refString.match(/\(.*\)/g);
        if (matchReplaceKey) {
            valueType = refString.replace(matchReplaceKey[0], '');
            var replaceKeyStr = matchReplaceKey[0].replace(/\(|\)|\s/g, '');
            var replaceKeyArr = replaceKeyStr.split(',');
            for (var _i = 0, replaceKeyArr_1 = replaceKeyArr; _i < replaceKeyArr_1.length; _i++) {
                var item = replaceKeyArr_1[_i];
                if (item.indexOf(':&') >= 0) {
                    var splitItem = item.split(':');
                    this.refReplace = this.refReplace || {};
                    this.refReplace[splitItem[0]] = splitItem[1];
                }
            }
        }
        else {
            valueType = refString;
        }
        return valueType;
    };
    return Response;
}());
var SuccessResponse = (function (_super) {
    __extends(SuccessResponse, _super);
    function SuccessResponse(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'SuccessResponse';
        return _this;
    }
    return SuccessResponse;
}(Response));
exports.SuccessResponse = SuccessResponse;
var ErrorResponse = (function (_super) {
    __extends(ErrorResponse, _super);
    function ErrorResponse(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'ErrorResponse';
        return _this;
    }
    return ErrorResponse;
}(Response));
exports.ErrorResponse = ErrorResponse;
