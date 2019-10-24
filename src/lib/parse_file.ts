// import * as path from "path";
import * as fs from "fs-extra";
import * as readline from "readline";



// function outputPath () : void {
//   console.log(process.cwd())
//   console.log(__dirname)
//   console.log(path.resolve(__dirname, '../'))
// }

class ParseFile {

  inputFile: string;
  outputPath: string;

  constructor (inputFile: string, outputPath: string) {
    this.inputFile = inputFile;
    this.outputPath = outputPath || process.cwd();
    this.readFile();
  }

  readFile(): void {
    const rl = readline.createInterface({
      input: fs.createReadStream(this.inputFile),
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
