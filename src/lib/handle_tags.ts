/**
 * @file deal with api doc tag
 */
import regexConfig from '../regex_config';

enum EffectiveTags {
  ApiStart,
  Version,
  Description,
  Deprecated,
  Api,
  Name,
  Group,
  HeaderParam,
  Param,
  QueryParam,
  BodyParam,
  ContentType,
  SuccessResponse,
  ErrorResponse,
  Reuse,
  Define,
  ApiEnd
}

/**
 * the apiDoc tag prefix:
 * example: @ApiStart @ApiEnd @Version ...
 */
let symbol: string = '@';
let matchTag: RegExp = new RegExp(`^${symbol}[A-Z]\\S+\\s+`);


/**
 * replace white space
 * @param line api doc line string
 * @param fileType the file type
 */
export function trimLine (line: string, fileType: string): string {
  line = line.replace(/(^\s*)|(\s*$)/g, '');
  line = line.replace(regexConfig[fileType].prefixRegex, '');
  line = line.replace(regexConfig[fileType].suffixRegex, '');
  return line;
}

/**
 * @return {err: Error | null, key:string, content:string}
*/
export function parseLine (line: string): {err: Error | null, key: string, content: string} {
  if (line.indexOf(symbol) >= 0) {
    let testMatch = line.match(matchTag);
    if (testMatch) {
      let replaceReg = new RegExp(`(${symbol})|\\s`, 'g');
      let key = testMatch[0].replace(replaceReg, '');
      if (Object.keys(EffectiveTags).indexOf(key) >= 0) {
        let content = line.replace(testMatch[0], '');
        return {err: null, key: key, content: content};
      } else {
        return {err: new Error(`unknow tag: "${symbol}${key}"`), key: '', content: ''};
      }
    } else {
      return {err: new Error(`can not parse line: "${line}"`), key: '', content: ''};
    }
  } else {
    return {err: null, key: '', content: line};
  }
}

/**
 * check api doc start
 */
export function apiStart (line: string): boolean {
  let reg = new RegExp(`${symbol}ApiStart`)
  return reg.test(line);
}

/**
 * check api doc end
 */
export function apiEnd (line: string): boolean {
  let reg = new RegExp(`${symbol}ApiEnd`)
  return reg.test(line);
}