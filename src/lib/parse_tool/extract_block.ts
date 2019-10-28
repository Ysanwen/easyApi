/**
 * @file extract api block
 */
import * as fs from "fs-extra";
import * as readline from "readline";
import guessFileType from './guess_file_type';
import regexConfig from './regex_config';

class ExtractBlock {
  inputFile: string;
  blockBegin: boolean = false;
  blockEnd: boolean = false;
  cacheLine: string[] = [];
  fileType: string;

  constructor (inputFile: string) {
    this.inputFile = inputFile;
    this.fileType = guessFileType(inputFile);
  }

  doExtract():void {
    const rl = readline.createInterface({
      input: fs.createReadStream(this.inputFile),
      crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
      this.parseLine(line);
    });
  }

  parseLine(line: string): void {
    if (/@ApiStart/.test(line)) {
      this.blockBegin = true;
    } else if (/@ApiEnd/.test(line)) {
      this.blockEnd = true;
      this.parseBlock();
    } else if (this.blockBegin) {
      // replace white space
      line = line.replace(/(^\s*)|(\s*$)/g, '');
      line = line.replace(regexConfig[this.fileType].prefixRegex, '');
      line = line.replace(regexConfig[this.fileType].suffixRegex, '');
      this.cacheLine.push(line);
    }
  }

  parseBlock (): void {
    console.log(this.cacheLine);
    this.blockBegin = false;
    this.blockEnd = false;
    this.cacheLine = [];
  }
}

export default ExtractBlock;