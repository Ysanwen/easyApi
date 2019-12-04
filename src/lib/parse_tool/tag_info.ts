/**
 * @file api doc tag info
 */

/**
 * @param {string} name the apidoc tag  name
 * @param {string} method the api request method
 * @param {string} path the api request path
 * @param {string} description the description of tag
 * @param {string} replaceWith for deprecated apis
 * @param {string} key for key of tag
 * @param {string} valueType value type of tag
 * @param {boolean} isRequired the value is required or not
 * @param {Error} error the error
 */
interface TagInfo {
  name: string,
  method?: string,
  path?: string,
  description?: string;
  replaceWith?: string;
  key?: string;
  valueType?: string;
  isRequired?: boolean;
  appendDescription?(content: string): void;
  error?: Error;
}

export default TagInfo;
export * from './api';
export * from './content_type';
export * from './define';
export * from './deprecated';
export * from './description';
export * from './group';
export * from './name';
export * from './param';
export * from './response';
export * from './reuse';
export * from './version';
