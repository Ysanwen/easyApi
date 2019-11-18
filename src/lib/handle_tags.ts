/**
 * @file deal with api doc tag
 */
import regexConfig from '../regex_config';
import * as EffectiveTags from './parse_tool/tag_info';
import TagInfo from './parse_tool/tag_info';

/**
 * the apiDoc tag prefix:
 * example: @ApiStart @ApiEnd @Version ...
 */
let symbol: string = '@';
let matchTag: RegExp = new RegExp(`^${symbol}[A-Z]\\S+\\s+`);

let effectiveKeys =  Object.keys(EffectiveTags);

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

export function parseLine (line: string): {err: Error | null, content: string, tagInfo: TagInfo | null} {
  if (line.indexOf(symbol) >= 0) {
    let testMatch = line.match(matchTag);
    if (testMatch) {
      let replaceReg = new RegExp(`(${symbol})|\\s`, 'g');
      let key: string= testMatch[0].replace(replaceReg, '');
      if (effectiveKeys.indexOf(key) >= 0) {
        let content = line.replace(testMatch[0], '');
        content = content.replace(/(^\s*)|(\s*$)/g, '');
        let tagInfo: TagInfo = new EffectiveTags[key](content);
        return {err: null, content: '', tagInfo: tagInfo};
      } else {
        return {err: new Error(`unknow tag: "${symbol}${key}"`), content: '', tagInfo: null};
      }
    } else {
      return {err: new Error(`can not parse line: "${line}"`), content: '', tagInfo: null};
    }
  } else {
    return {err: null, content: line, tagInfo: null};
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