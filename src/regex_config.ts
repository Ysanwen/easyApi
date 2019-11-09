/**
 * @file config annotation prefix and suffix of defferent file type
 */


/**
 * prefixRegex： the regexp match the annotation line begin  
 * suffixRegex: the regexp match the annotation line end
 * fileSuffix: the file suffix
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