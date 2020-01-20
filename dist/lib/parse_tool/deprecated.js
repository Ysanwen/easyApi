"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Deprecated = (function () {
    function Deprecated(content) {
        this.name = 'Deprecated';
        this.error = null;
        var hasReplace = content.match(/\(\s*ReplaceWith.*\)/);
        if (hasReplace) {
            var replace = hasReplace[0];
            this.replaceWith = replace.replace(/\(|(ReplaceWith)|:|\)|\s/g, '');
            this.description = content.replace(replace, "(" + this.replaceWith + ")");
        }
        else {
            this.description = content;
            this.replaceWith = '';
        }
    }
    Deprecated.prototype.appendDescription = function (content) {
        this.description += content;
    };
    return Deprecated;
}());
exports.Deprecated = Deprecated;
