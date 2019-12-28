"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var color_log_1 = require("./color_log");
var config = {
    version: '1.0.0',
    title: 'easy api doc',
    input: '',
    output: './api_doc',
    baseUrl: '',
    config: './easy.config.json',
    server: 'localhost',
    port: '9527'
};
function checkInput(config) {
    if (!config.input) {
        color_log_1.errorLog('the input file path must be specified');
        return false;
    }
    else {
        var hasNoErr_1 = true;
        var _inputPath = config.input.indexOf(',') >= 0 ? config.input.split(',') : [config.input];
        _inputPath = _inputPath.map(function (item) {
            var _path = path.resolve(process.cwd(), item);
            if (!fs.existsSync(_path)) {
                hasNoErr_1 = false;
                color_log_1.errorLog("no this file path " + item);
            }
            return _path;
        });
        hasNoErr_1 && (config['_inputPath'] = _inputPath);
        return hasNoErr_1;
    }
}
exports.checkInput = checkInput;
function generateConfigJson(cmdObject, callback) {
    for (var key in config) {
        key !== 'version' && key !== 'server' && cmdObject[key] && (config[key] = cmdObject[key]);
        cmdObject.server !== true && (config.server = cmdObject.server);
    }
    if (cmdObject.config) {
        var cfgPath_1 = path.resolve(process.cwd(), cmdObject.config);
        var err_1 = null;
        if (fs.existsSync(cfgPath_1)) {
            fs.readJSON(cfgPath_1, function (error, configJson) {
                if (error) {
                    err_1 = new Error("some error with config file: " + cfgPath_1 + " " + error.message);
                }
                else {
                    for (var key in configJson) {
                        key === 'version' ? config[key] = configJson[key] : configJson[key] && (config[key] = config[key] || configJson[key]);
                    }
                }
                err_1 ? callback(err_1, null) : callback(null, config);
            });
        }
        else {
            err_1 = new Error("no this config file: " + cfgPath_1);
            callback(err_1, null);
        }
    }
    else {
        callback(null, config);
    }
}
exports.generateConfigJson = generateConfigJson;
function getConfig() {
    return config;
}
exports.getConfig = getConfig;
