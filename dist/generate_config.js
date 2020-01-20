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
    server: '',
    port: ''
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
    var configFile = cmdObject.config || '';
    var cfgPath = '';
    if (configFile) {
        cfgPath = path.resolve(process.cwd(), configFile);
        if (!fs.existsSync(cfgPath)) {
            callback(new Error("no this config file: " + configFile), null);
            return;
        }
    }
    cfgPath = cfgPath || path.resolve(process.cwd(), config.config);
    var err = null;
    if (fs.existsSync(cfgPath)) {
        fs.readJSON(cfgPath, function (error, configJson) {
            if (error) {
                err = new Error("some error with config file: " + cfgPath + " " + error.message);
            }
            else {
                for (var key in configJson) {
                    configJson[key] !== '' && (config[key] = configJson[key]);
                }
            }
            for (var key in config) {
                key !== 'version' && key !== 'server' && cmdObject[key] && (config[key] = cmdObject[key]);
                cmdObject.server && cmdObject.server !== true && (config.server = cmdObject.server);
            }
            err ? callback(err, null) : callback(null, config);
        });
    }
    else {
        for (var key in config) {
            key !== 'version' && key !== 'server' && cmdObject[key] && (config[key] = cmdObject[key]);
            cmdObject.server && cmdObject.server !== true && (config.server = cmdObject.server);
        }
        err ? callback(err, null) : callback(null, config);
    }
}
exports.generateConfigJson = generateConfigJson;
function getConfig() {
    return config;
}
exports.getConfig = getConfig;
