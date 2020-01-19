"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var fs = require("fs-extra");
var proxy = require("http-proxy-middleware");
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
        fs.existsSync(staticPath) && this.appServer.use(express.static(staticPath));
        this.setProxy();
        this.appServer.use('*', function (req, res) {
            var randomNum = Math.floor(Math.random() * 1000);
            res.json({ status: 'success', message: 'welcome to use easy api with: ' + randomNum + ' request!' });
        });
    };
    Server.prototype.setProxy = function () {
        var proxyObject = this.config.proxy || {};
        for (var key in proxyObject) {
            this.appServer.use(key, proxy(proxyObject[key]));
        }
    };
    Server.prototype.startServer = function () {
        var host = this.config.server || 'localhost';
        var port = this.config.port || 9527;
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
