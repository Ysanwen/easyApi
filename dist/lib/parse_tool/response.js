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
        if (/^\d+$/.test(restArr[0])) {
            this.responseCode = parseInt(restArr[0]);
            this.description = restArr[1];
        }
        else {
            this.description = rest;
        }
    }
    Response.prototype.appendDescription = function (content) {
        this.description += content;
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
