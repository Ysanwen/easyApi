import { Command } from 'commander';
import Server from './server';
import { ConfigObject, generateConfigJson, checkInput } from './generate_config';
import { errorLog } from './color_log';
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
  { flag: '-i, --input <file>', description: 'input file or directory, must be specified' },
  { flag: '-o, --output <path>', description: 'output api doc file directory, default will create a "api_doc" folder in current working directory' },
  { flag: '-c, --config <file>', description: 'the config.js file, default will look for "easy.config.js" in current working directory' },
  { flag: '-s, --server [serveraddr]', description: 'static server host, default will use "localhost"' },
  { flag: '-p, --port <port>', description: 'static server port, default will use 9527' }
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
    // if (process.argv.length <= 2) {
    //   this.commander.outputHelp();
    // }
    generateConfigJson(this.commander, (err, config: ConfigObject) => {
      if (err) {
        errorLog(err.message);
        process.exit(1);
      } else {
        if (this.commander.server || this.commander.port) {
          this.startServer();
        } else {
          config._startTime = Math.floor(new Date().getTime() / 1000);
          this.startParseFile(config);
        }
      }
    })
  }

  startParseFile (config: ConfigObject):void {
    if (checkInput(config)) {
      let newParse = new ParseFile(config);
      newParse.parseAllFile();
    } else {
      this.commander.outputHelp();
      process.exit(1);
    }
  }

  startServer (): void {
    let app = new Server();
    app.startServer();
  }
}