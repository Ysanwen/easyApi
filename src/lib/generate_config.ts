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
 * config: the config json file path
 */
export interface ConfigObject {
  version: string;
  title: string;
  input: string;
  output: string;
  config: string;
  baseUrl: string;
  [key: string]: any;
}

const config: ConfigObject = {
  version: 'v1.0.0',
  title: 'easy api doc',
  input: '',
  output: './api_doc',
  baseUrl: '',
  config: './easy.config.json',
}

function checkInput (): boolean {
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
            if (key === 'version') {
              config[key] = configJson[key];
            } else {
              configJson[key] && (config[key] = config[key] || configJson[key]);
            }
          }
          if (!checkInput()) {
            err = new Error(`input file  error: ${config.input}`);
          }
        }
        err ? callback(err, null) : callback(null, config);
      })
    } else {
      err = new Error(`no this config file: ${cfgPath}`);
      callback(err, null);
    }
  } else {
    checkInput() ? callback(null, config) : callback(new Error(`input file  error: ${config.input}`), null);
  }
}

export function getConfig (): ConfigObject {
  return config
}