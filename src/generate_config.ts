/**
 * @file config
 */
import * as fs from "fs-extra";
import * as path from "path";
import { errorLog } from './color_log';
import { Command } from 'commander';

interface CallbackFunction {
  (err: Error, config: ConfigObject): void
}

/**
 * version: api version  
 * title: api doc title  
 * input: the input source file or directory  
 * output: the ouptut document directory  
 * baseUrl: the host of api request  
 * config: the config json file path  
 * server: static web server host  
 * port: static web server port
 * tryRequest: whether can send request in document default is true
 */
export interface ConfigObject {
  version: string;
  title: string;
  input: string;
  output: string;
  baseUrl: string;
  config: string;
  server: string;
  port: string;
  [key: string]: any;
}

const config: ConfigObject = {
  version: '1.0.0',
  title: 'easy api doc',
  input: '',
  output: './api_doc',
  baseUrl: '',
  config: './easy.config.js',
  server: '',
  port: ''
}

// check the config file is available
export function checkInput (config: ConfigObject): boolean {
  if (!config.input) {
    errorLog('the input file path must be specified')
    return false;
  } else {
    let hasNoErr = true;
    let _inputPath = config.input.indexOf(',') >= 0 ? config.input.split(',') : [config.input];
    _inputPath = _inputPath.map((item) => {
      let _path = path.resolve(process.cwd(), item);
      if (!fs.existsSync(_path)) {
        hasNoErr = false;
        errorLog(`no this file path ${item}`)
      }
      return _path;
    })
    hasNoErr && (config['_inputPath'] = _inputPath)
    return hasNoErr;
  }
}

/**
 * read the config file from the cmd -c command if the specified file is exist  
 * else try read the default config file "easy.config.json"
 * 
 * if the config read from config.json has the same keys in cmd  
 * then the cmd value will be used instead
 * 
*/
export function generateConfigJson (cmdObject: Command, callback: CallbackFunction): void {
  let configFile = cmdObject.config || '';
  let cfgPath = '';
  if (configFile) {
    cfgPath = path.resolve(process.cwd(), configFile);
    if (!fs.existsSync(cfgPath)) {
      callback(new Error(`no this config file: ${configFile}`), null);
      return;   
    }
    if (!(/\.js$/).test(cfgPath)) {
      callback(new Error(`the config file must be a JavaScript file: ${configFile}`), null);
      return;
    }
  }
  cfgPath = cfgPath || path.resolve(process.cwd(), config.config);
  let err: Error = null;
  if (fs.existsSync(cfgPath)) {
    import(cfgPath).then((configObj) => {
      for (let key in configObj) {
        configObj[key] !== '' && (config[key] = configObj[key]);
      }
      for (let key in config) {
        key !== 'version' && key !== 'server' && cmdObject[key] && (config[key] = cmdObject[key])
        cmdObject.server && cmdObject.server !== true && (config.server = cmdObject.server)
      }
      err ? callback(err, null) : callback(null, config);
    })

    // fs.readJSON(cfgPath, function (error, configJson) {
    //   if (error) {
    //     err = new Error(`some error with config file: ${cfgPath} ${error.message}`);
    //   } else {
    //     for (let key in configJson) {
    //       configJson[key] !== '' && (config[key] = configJson[key]);
    //     }
    //   }
    //   for (let key in config) {
    //     key !== 'version' && key !== 'server' && cmdObject[key] && (config[key] = cmdObject[key])
    //     cmdObject.server && cmdObject.server !== true && (config.server = cmdObject.server)
    //   }
    //   err ? callback(err, null) : callback(null, config);
    // })
  } else {
    for (let key in config) {
      key !== 'version' && key !== 'server' && cmdObject[key] && (config[key] = cmdObject[key])
      cmdObject.server && cmdObject.server !== true && (config.server = cmdObject.server)
    }
    err ? callback(err, null) : callback(null, config);
  }
}

export function getConfig (): ConfigObject {
  return config
}