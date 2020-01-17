/**
 * @file guess file type default type js javascript file
 */
import regexConfig from '../regex_config'; 

function getSuffix (filename: string): string {
  let testMatch =  filename.match(/\.[a-zA-Z]+$/g);
  return testMatch ? testMatch[0] : '';
}

export default function guessFileType (filename: string): string {
  let suffix = getSuffix(filename);
  let defaultFileType = 'javascript';
  for (let key in regexConfig) {
    if (regexConfig[key].fileSuffix.indexOf(suffix) >= 0) {
      defaultFileType =  key;
      break;
    }
  }
  return defaultFileType;
}