import * as express from 'express';
import * as path from 'path';
import * as fs from "fs-extra";
import * as proxy from 'http-proxy-middleware';
import { ConfigObject, getConfig } from './generate_config';
import { errorLog, successLog } from './color_log';

class Server {
  appServer;
  config: ConfigObject;
  constructor () {
    this.appServer = express();
    this.config = getConfig();
    this.setUpApp();
  }

  protected setUpApp (): void{
    // 设置跨越
    this.appServer.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Expose-Headers', '*');
      if (req.method === 'options' || req.method === 'OPTIONS') {
        res.end()
      } else {
        next();
      }
    })
    // set static directory
    let staticPath = path.resolve(process.cwd(), this.config.output);
    fs.existsSync(staticPath) && this.appServer.use(express.static(staticPath));
    // set proxy if config file with proxy settings
    this.setProxy();
    // set demo reponse
    this.appServer.use('*', (req, res) => {
      let randomNum = Math.floor(Math.random() * 1000);
      res.json({ status: 'success', message: 'welcome to use easy api with: ' + randomNum + ' request!' });
    })
  }

  setProxy (): void{
    let proxyObject = this.config.proxy || {};
    for (let key in proxyObject) {
      this.appServer.use(key, proxy(proxyObject[key]));
    }
  }

  startServer ():void {
    let host = this.config.server || 'localhost';
    let port = this.config.port || 9527;
    this.appServer.listen(port, host, (err) => {
      if (err) {
        errorLog(err.message)
        return false
      }
      successLog('server start at ' + host  + ':' + port);
    })
  }
}

export default Server;