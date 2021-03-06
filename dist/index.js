"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMD = void 0;
var commander_1 = require("commander");
var server_1 = require("./server");
var generate_config_1 = require("./generate_config");
var color_log_1 = require("./color_log");
var parse_file_1 = require("./parse_file");
var version = '0.0.1';
var options = [
    { flag: '-i, --input <file>', description: 'input file or directory, must be specified' },
    { flag: '-o, --output <path>', description: 'output api doc file directory, default will create a "api_doc" folder in current working directory' },
    { flag: '-c, --config <file>', description: 'the config.js file, default will look for "easy.config.js" in current working directory' },
    { flag: '-s, --server [serveraddr]', description: 'static server host, default will use "localhost"' },
    { flag: '-p, --port <port>', description: 'static server port, default will use 9527' }
];
var CMD = (function () {
    function CMD() {
        this.commander = new commander_1.Command();
        this.commander.version(version);
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var op = options_1[_i];
            this.commander.option(op.flag, op.description, op.process, op.default);
        }
    }
    CMD.prototype.startCmd = function () {
        var _this = this;
        this.commander.parse(process.argv);
        generate_config_1.generateConfigJson(this.commander, function (err, config) {
            if (err) {
                color_log_1.errorLog(err.message);
                process.exit(1);
            }
            else {
                if (_this.commander.server || _this.commander.port) {
                    _this.startServer();
                }
                else {
                    config._startTime = Math.floor(new Date().getTime() / 1000);
                    _this.startParseFile(config);
                }
            }
        });
    };
    CMD.prototype.startParseFile = function (config) {
        if (generate_config_1.checkInput(config)) {
            var newParse = new parse_file_1.default(config);
            newParse.parseAllFile();
        }
        else {
            this.commander.outputHelp();
            process.exit(1);
        }
    };
    CMD.prototype.startServer = function () {
        var app = new server_1.default();
        app.startServer();
    };
    return CMD;
}());
exports.CMD = CMD;
