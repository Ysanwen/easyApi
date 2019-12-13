import { Command } from 'commander';
import Server from './server';
import { ConfigObject, generateConfigJson, checkInput } from './generate_config';
import ParseFile from './parse_file';


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
  { flag: '-c, --config <file>', description: 'the config.json file' },
  { flag: '-s, --server [serveraddr]', description: 'static server host' },
  { flag: '-p, --port <port>', description: 'static server port' }
]


export class CMD {
  commander: Command;

  constructor() {
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
        if (config.input) {
          this.startParseFile(config);
        }
        if (this.commander.server || this.commander.port) {
          this.startServer();
        }
      }
    })
  }

  startParseFile (config: ConfigObject):void {
    if (checkInput(config)) {
      let newParse = new ParseFile(config);
      newParse.parseAllFile();
    } else {
      process.exit(1);
    }
  }

  startServer (): void {
    let app = new Server();
    app.startServer();
  }
}