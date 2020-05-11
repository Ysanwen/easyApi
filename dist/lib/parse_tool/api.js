"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var split_str_1 = require("./split_str");
var EffectiveMethods = ['get', 'post', 'put', 'delete', 'patch'];
var Api = (function () {
    function Api(content) {
        this.name = 'Api';
        this.method = 'get';
        this.path = '/';
        this.error = null;
        var splitArr = split_str_1.default(content);
        var method = splitArr[0].toLocaleLowerCase();
        if (!method || EffectiveMethods.indexOf(method) < 0) {
            this.error = new Error('no effective method');
        }
        else {
            this.method = method;
            var rest = splitArr[1];
            rest = rest.replace(/(^\s*)|(\s*$)/g, '');
            var path = split_str_1.default(rest)[0];
            if (!path) {
                this.error = new Error('no effective path');
            }
            else {
                this.path = path;
            }
        }
    }
    return Api;
}());
exports.Api = Api;
