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
var EffectiveValueType = [
    'string', 'number', 'integer', 'float', 'boolean', 'array', 'object', 'null', 'date', 'datetime',
    'string[]', 'number[]', 'integer[]', 'float[]', 'boolean[]', 'array[]', 'object[]', 'null[]', 'date[]', 'datetime[]'
];
var Param = (function () {
    function Param(content) {
        this.name = 'Param';
        this.isRequired = true;
        this.error = null;
        var matchValue = content.match(/\{.*\}\s*/);
        if (matchValue) {
            var value = matchValue[0].replace(/\{|\}|\s/g, '');
            var valueType = value.toLocaleLowerCase();
            if (EffectiveValueType.indexOf(valueType) >= 0 || valueType.indexOf('$ref') >= 0) {
                this.valueType = valueType.indexOf('$ref') >= 0 ? value : valueType;
                var restStr = content.replace(matchValue[0], '');
                var paramsKeyMatch = restStr.match(/^\S+\s*/);
                if (paramsKeyMatch) {
                    this.key = paramsKeyMatch[0] ? paramsKeyMatch[0].replace(/\s/g, '') : '';
                    if (this.key.indexOf('[') >= 0 && this.key.indexOf(']') >= 0) {
                        this.isRequired = false;
                        this.key = this.key.replace(/\[|\]/g, '');
                    }
                    this.description = restStr.replace(paramsKeyMatch[0], '');
                }
                if (!this.key) {
                    this.error = new Error(this.name + " must has a param");
                }
            }
            else {
                this.error = new Error(this.name + " has unsupport type: \"" + value + "\"");
            }
        }
        else {
            this.error = new Error(this.name + " must has a param type");
        }
    }
    Param.prototype.appendDescription = function (content) {
        this.description += content;
    };
    return Param;
}());
var UrlParam = (function (_super) {
    __extends(UrlParam, _super);
    function UrlParam(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'UrlParam';
        return _this;
    }
    return UrlParam;
}(Param));
exports.UrlParam = UrlParam;
var HeaderParam = (function (_super) {
    __extends(HeaderParam, _super);
    function HeaderParam(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'HeaderParam';
        return _this;
    }
    return HeaderParam;
}(Param));
exports.HeaderParam = HeaderParam;
var QueryParam = (function (_super) {
    __extends(QueryParam, _super);
    function QueryParam(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'QueryParam';
        return _this;
    }
    return QueryParam;
}(Param));
exports.QueryParam = QueryParam;
var BodyParam = (function (_super) {
    __extends(BodyParam, _super);
    function BodyParam(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'BodyParam';
        return _this;
    }
    return BodyParam;
}(Param));
exports.BodyParam = BodyParam;
var Property = (function (_super) {
    __extends(Property, _super);
    function Property(content) {
        var _this = _super.call(this, content) || this;
        _this.name = 'Property';
        return _this;
    }
    return Property;
}(Param));
exports.Property = Property;
