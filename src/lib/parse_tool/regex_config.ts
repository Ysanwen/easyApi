/**
 * @file config annotation prefix and suffix of defferent file type
 */

interface LanguageConfig {
  prefixRegex: RegExp;
  suffixRegex: RegExp;
  fileSuffix: string;
}

interface RegexConfig {
  [key: string]: LanguageConfig;
}

const regexConfig: RegexConfig = {
  "javascript": {
    prefixRegex: /^[\/\*]*\s?/g,
    suffixRegex: /\s?\*+\/$/g,
    fileSuffix: 'js, ts, javascript',
  }
}
export default regexConfig