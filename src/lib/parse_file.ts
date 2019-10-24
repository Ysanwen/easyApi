import * as path from "path";
import * as fs from "fs-extra";
import * as readline from "readline";
import Config from './config';



// function outputPath () : void {
//   console.log(process.cwd())
//   console.log(__dirname)
//   console.log(path.resolve(__dirname, '../'))
// }

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
    for (let file of this.inputFiles) {
      this.readFile(file);
    }
  }

  readFile(file: string):void {
    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
      this.parseLine(line);
    });
  }

  parseLine(line: string): void {
    console.log(line);
  }
}

export default ParseFile;
