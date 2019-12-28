import * as chalk from 'chalk';

export function errorLog (msg: string):void {
  // console.log(chalk.bold.magentaBright(msg));
  console.log(chalk.bold.redBright(msg));
}

export function warnLog (msg: string):void {
  console.log(chalk.bold.yellowBright(msg));
}

export function successLog (msg: string):void {
  console.log(chalk.bold.green(msg));
}

export function infoLog (msg: string):void {
  console.log(chalk.bold.cyanBright(msg));
}