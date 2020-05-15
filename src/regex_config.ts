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
  fileSuffix: string[];
}

interface RegexConfig {
  [key: string]: LanguageConfig;
}

const regexConfig: RegexConfig = {
  "javascript": {
    prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
    suffixRegex: /\s*\*\/\s*$/g,
    fileSuffix: ['.js', '.ts', '.javascript'],
  },
  "java": {
    prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
    suffixRegex: /\s*\*\/\s*$/g,
    fileSuffix: ['.java'],
  },
  "c": {
    prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
    suffixRegex: /\s*\*\/\s*$/g,
    fileSuffix: ['.c', '.cpp', '.cs'],
  },
  "php": {
    prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
    suffixRegex: /\s*\*\/\s*$/g,
    fileSuffix: ['.php'],
  },
  "swift": {
    prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
    suffixRegex: /\s*\*\/\s*$/g,
    fileSuffix: ['.swift'],
  },
  "go": {
    prefixRegex: /^\/\/\s*|^\/\*\s*|^\*\s*/g,
    suffixRegex: /\s*\*\/\s*$/g,
    fileSuffix: ['.go'],
  },
  "python": {
    prefixRegex: /^#\s*|^\"{3}\s*|^\'{3}\s*/g,
    suffixRegex: /\"{3}\s*$|\'{3}\s*$/g,
    fileSuffix: ['.py'],
  }
}
export default regexConfig;