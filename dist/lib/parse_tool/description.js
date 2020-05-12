"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Description = (function () {
    function Description(content) {
        this.name = 'Description';
        this.error = null;
        this.description = content.replace(/^\s+|\s+$/g, '');
    }
    Description.prototype.appendDescription = function (content) {
        this.description += (this.description ? '\n' : '') + "content";
    };
    return Description;
}());
exports.Description = Description;
