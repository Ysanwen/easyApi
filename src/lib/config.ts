/**
 * @file config
 */
import * as fs from "fs-extra";
import * as path from "path";

interface CallbackFunction {
  (err: Error, result: Config): void
}

class Config {
  version = 'v1.0';
  title = 'easy api doc';
  input: string;
  outputPath = './api_doc';
  [key: string]: any;

  parseConfigJson (configPath: string, callback:CallbackFunction): void {
    let filePath = path.resolve(process.cwd(), configPath);
    if (fs.existsSync(filePath)) {
      fs.readJSON(filePath, function (error,configJson) {
        if (error) {
          let err = new Error(`some error with config file: ${configPath} ${error.message}`);
          callback(err, null);
        } else {
          configJson.version && (this.version = configJson.version)
          configJson.title && (this.title = configJson.title)
          configJson.input && (this.input = configJson.input)
          configJson.outputPath && (this.outputPath = configJson.outputPath)
          callback(null, this)
        }
      })
    } else {
      let err = new Error(`no this config file: ${configPath}`);
      callback(err, null);
    }
  }

  updateConfig (key: string, value: string): void {
    // if (key === 'input' || key === 'outputPath') {
    //   value = path.resolve(process.cwd(), value);
    // }
    this[key] = value;
  }

  checkInput (): boolean {
    if (!this.input) {
      console.log('the input file path must be specified')
      return false;
    } else {
      let hasNoErr = true;
      let _inputPath = this.input.indexOf(',') >= 0 ? this.input.split(',') : [this.input];
      _inputPath = _inputPath.map((item) => {
        let _path = path.resolve(process.cwd(), item);
        if (!fs.existsSync(_path)) {
          hasNoErr = false;
          console.log(`no this file path ${item}`)
        }
        return _path;
      })
      hasNoErr && (this['_inputPath'] = _inputPath)
      return hasNoErr;
    }
  }
}

export default Config;