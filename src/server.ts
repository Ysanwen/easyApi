import * as express from 'express';
import * as path from 'path';
import { ConfigObject, getConfig } from './generate_config';

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
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      res.header('Access-Control-Expose-Headers', '*');
      if (req.method === 'options' || req.method === 'OPTIONS') {
        res.end()
      } else {
        next();
      }
    })
    // set static directory
    let staticPath = path.resolve(process.cwd(), this.config.output);
    this.appServer.use(express.static(staticPath));
    // set demo reponse
    this.appServer.use('*', (req, res) => {
      let randomNum = Math.floor(Math.random() * 1000);
      res.json({ status: 'success', message: 'welcome to use easy api with: ' + randomNum + ' request!' });
    })
  }

  startServer ():void {
    let host = this.config.server;
    let port = this.config.port;
    this.appServer.listen(port, host, (err) => {
      if (err) {
        console.log(err)
        return false
      }
      console.log('server start at ' + host  + ':' + port)
    })
  }
}

export default Server;