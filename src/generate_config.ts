/**
 * @file config
 */
import * as fs from "fs-extra";
import * as path from "path";
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
  version: 'v1.0.0',
  title: 'easy api doc',
  input: '',
  output: './api_doc',
  baseUrl: '',
  config: './easy.config.json',
  server: 'localhost',
  port: '8081'
}

// check the input file is available
export function checkInput (config: ConfigObject): boolean {
  if (!config.input) {
    console.log('the input file path must be specified')
    return false;
  } else {
    let hasNoErr = true;
    let _inputPath = config.input.indexOf(',') >= 0 ? config.input.split(',') : [config.input];
    _inputPath = _inputPath.map((item) => {
      let _path = path.resolve(process.cwd(), item);
      if (!fs.existsSync(_path)) {
        hasNoErr = false;
        console.log(`no this file path ${item}`)
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
  for (let key in config) {
    key !== 'version' && cmdObject[key] && (config[key] = cmdObject[key])
  }
  if (cmdObject.config) {
    let cfgPath = path.resolve(process.cwd(), cmdObject.config);
    let err: Error = null;
    if (fs.existsSync(cfgPath)) {
      fs.readJSON(cfgPath, function (error,configJson) {
        if (error) {
          err = new Error(`some error with config file: ${cfgPath} ${error.message}`);
        } else {
          for (let key in configJson) {
            key === 'version' ? config[key] = configJson[key] : configJson[key] && (config[key] = config[key] || configJson[key]);
          }
        }
        err ? callback(err, null) : callback(null, config);
      })
    } else {
      err = new Error(`no this config file: ${cfgPath}`);
      callback(err, null);
    }
  } else {
    callback(null, config);
  }
}

export function getConfig (): ConfigObject {
  return config
}