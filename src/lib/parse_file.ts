import * as path from "path";
import * as fs from "fs-extra";
import ExtractBlock from "./parse_tool/extract_block";
import Config from './config';

class ParseFile {

  inputFiles: string[];
  outputPath: string;

  constructor (config: Config) {
    let _inputPath = config._inputPath;
    let fileArray:string[] = [];
    for (let pathStr of _inputPath) {
      fileArray = fileArray.concat(this.parsePath(pathStr));
    }
    this.inputFiles = fileArray;
    this.outputPath = config.outputPath || path.resolve(process.cwd(), './api_doc');
  }

  parsePath (pathStr: string): string[] {
    let fileArray:string[] = [];
    let status = fs.lstatSync(pathStr);
    if (status.isDirectory()) {
      let pathList = fs.readdirSync(pathStr);
      pathList = pathList.map((subPath) => {
        let newPath = path.resolve(pathStr, subPath);
        fileArray = fileArray.concat(this.parsePath(newPath))
        return newPath;
      })
    } else if (status.isFile()) {
      fileArray.push(pathStr);
    }
    return fileArray; 
  }

  parseAllFile (): void {
    console.log(this.inputFiles)
    for (let file of this.inputFiles) {
      let extract_block = new ExtractBlock(file);
      extract_block.doExtract()
    }
  }
}

export default ParseFile;
