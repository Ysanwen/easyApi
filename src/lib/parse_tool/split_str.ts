/**
 * split the input str from the first white space
 * @param str input string
 * @return array result with the word before the first white space and the rest after
 */
export default function splitStr(str: string): string[] {
  let result: string[] = ['', ''];
  let isMatch = str.match(/^\S+\s*/);
  if (isMatch) {
    result[0] = isMatch[0].replace(/\s/g, '');
    result[1] = str.replace(isMatch[0], '');
  }
  return result;
}