/**
 * @file extract api block
 */
import * as fs from "fs-extra";
import * as readline from "readline";
import guessFileType from './guess_file_type';
import * as handleTags from './handle_tags';
import TagInfo from './parse_tool/tag_info';
import { getBlockInfo } from './block_info';

interface LineInfo {
  content: string;
  lineNumber: number;
}

class ExtractBlock {
  inputFile: string;
  blockBegin: boolean = false;
  cacheLine: LineInfo[] = [];
  fileType: string;
  fileName: string;
  lineNumber: number = 0;

  constructor (inputFile: string) {
    this.inputFile = inputFile;
    let splitFileName = inputFile.split('/');
    this.fileName = splitFileName[splitFileName.length - 1] || '';
    this.fileType = guessFileType(inputFile);
  }

  doExtract(callback: Function): void {
    const rl = readline.createInterface({
      input: fs.createReadStream(this.inputFile),
      crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
      this.lineNumber += 1;
      this.getLine(line);
    });

    rl.on('close', () => {
      callback()
    })
  }

  getLine(line: string): void {
    if (handleTags.apiStart(line)) {
      this.blockBegin = true;
      this.cacheLine = [];
    } else if (handleTags.apiEnd(line)) {
      this.parseBlock();
      this.blockBegin = false;
      this.cacheLine = [];
    } else if (this.blockBegin) {
      line = handleTags.trimLine(line, this.fileType);
      if (line) {
        let lineInfo: LineInfo = {
          content: line,
          lineNumber: this.lineNumber
        }
        this.cacheLine.push(lineInfo);
      }
    }
  }

  parseBlock (): void {
    let infoArray: TagInfo[] = [];
    let currentTagInfo: TagInfo = null;
    for (let lineInfo of this.cacheLine) {
      let parseInfo = handleTags.parseLine(lineInfo.content);
      if (parseInfo.err) {
        console.log(`${parseInfo.err.message} at line number ${lineInfo.lineNumber} of ${this.inputFile}`);
        currentTagInfo = null;
      } else {
        if (parseInfo.tagInfo) {
          if (parseInfo.tagInfo.error) {
            let errMsg = parseInfo.tagInfo.error.message;
            console.log(`${errMsg} at line number ${lineInfo.lineNumber} of ${this.inputFile}`);
            currentTagInfo = null;
          } else {
            infoArray.push(parseInfo.tagInfo);
            currentTagInfo = parseInfo.tagInfo;
          }
        } else {
          let content = '\r\n' + parseInfo.content;
          currentTagInfo && currentTagInfo.appendDescription && currentTagInfo.appendDescription(content);
        }
      }
    }
    // todo
    getBlockInfo(infoArray);
  }
}

export default ExtractBlock;