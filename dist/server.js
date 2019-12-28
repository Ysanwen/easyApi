"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var generate_config_1 = require("./generate_config");
var color_log_1 = require("./color_log");
var Server = (function () {
    function Server() {
        this.appServer = express();
        this.config = generate_config_1.getConfig();
        this.setUpApp();
    }
    Server.prototype.setUpApp = function () {
        this.appServer.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            res.header('Access-Control-Expose-Headers', '*');
            if (req.method === 'options' || req.method === 'OPTIONS') {
                res.end();
            }
            else {
                next();
            }
        });
        var staticPath = path.resolve(process.cwd(), this.config.output);
        this.appServer.use(express.static(staticPath));
        this.appServer.use('*', function (req, res) {
            var randomNum = Math.floor(Math.random() * 1000);
            res.json({ status: 'success', message: 'welcome to use easy api with: ' + randomNum + ' request!' });
        });
    };
    Server.prototype.startServer = function () {
        var host = this.config.server;
        var port = this.config.port;
        this.appServer.listen(port, host, function (err) {
            if (err) {
                color_log_1.errorLog(err.message);
                return false;
            }
            color_log_1.successLog('server start at ' + host + ':' + port);
        });
    };
    return Server;
}());
exports.default = Server;
