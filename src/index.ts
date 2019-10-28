import { Command } from 'commander';
import { ConfigObject, generateConfigJson } from './lib/generate_config';
import ParseFile from './lib/parse_file';


interface ProcessFunction {
  (value: string | number, previous: string | number): string | number
}

interface Options {
  flag: string;
  description: string;
  process?: ProcessFunction;
  default?: string | number;
}

const version = '0.0.1';
const options: Options[] = [
  { flag: '-i, --input <file>', description: 'input file or directory, default will walk through current working directory' },
  { flag: '-o, --output <path>', description: 'output file directory, default will create a "easyApi" folder in current working directory' },
  { flag: '-c, --config <file>', description: 'the config.json file' }
]


class CMD {
  commander: Command;

  constructor(options: Options[]) {
    this.commander = new Command();
    this.commander.version(version);
    for (let op of options) {
      this.commander.option(op.flag, op.description, op.process, op.default);
    }
  }

  startCmd(): void {
    this.commander.parse(process.argv);
    generateConfigJson(this.commander, (err, config: ConfigObject) => {
      if (err) {
        console.log(err.message);
        process.exit(1);
      } else {
        this.startParseFile(config)
      }
    })
  }

  startParseFile (config: ConfigObject):void {
    let newParse = new ParseFile(config);
    newParse.parseAllFile();
  }
}

let cmd = new CMD(options);
cmd.startCmd();