"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
function errorLog(msg) {
    console.log(chalk.bold.redBright(msg));
}
exports.errorLog = errorLog;
function warnLog(msg) {
    console.log(chalk.bold.yellowBright(msg));
}
exports.warnLog = warnLog;
function successLog(msg) {
    console.log(chalk.bold.green(msg));
}
exports.successLog = successLog;
function infoLog(msg) {
    console.log(chalk.bold.cyanBright(msg));
}
exports.infoLog = infoLog;
