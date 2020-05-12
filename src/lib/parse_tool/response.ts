import TagInfo from './tag_info';
import splitStr from './split_str';

const contentTypeReg = /(audio)|(application)|(video)|(image)|(text)|(font)\//;

class Response implements TagInfo {

  name: string = 'Response';
  description: string;
  responseType: string;
  responseCode: number;
  valueType: string = '';
  refReplace: any;
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    let responseType = splitArr[0];
    let rest = '';
    if (responseType && contentTypeReg.test(responseType)) {
      this.responseType = responseType;
      rest = splitArr[1];
    } else {
      this.responseType = 'application/json';
      rest = content;
    }

    let restArr = splitStr(rest);
    let description = '';
    if (/^\d+$/.test(restArr[0])) {
      this.responseCode = parseInt(restArr[0]);
      description = restArr[1].replace(/(^\s*)|(\s*$)/g, '');
    } else {
      description = rest.replace(/(^\s*)|(\s*$)/g, '');
    }
    // ref handle
    let testMatch = description.match(/\{\s*\&.*?\}/g);
    if (testMatch) {
      let valueType = testMatch[0];
      this.description = description.replace(valueType, '');
      valueType = valueType.replace(/\{|\}|\s/g, '');
      this.valueType = this.extraRefReplaceKey(valueType);
    } else {
      this.description = description;
    }
  }

  appendDescription (content: string) :void {
    this.description += `${this.description ? '\n' : ''}${content.replace(/(^\s*)|(\s*$)/g, '')}`;
  }

  extraRefReplaceKey (refString: string): string {
    let valueType = '';
    let matchReplaceKey = refString.match(/\(.*\)/g);
    if (matchReplaceKey) {
      valueType = refString.replace(matchReplaceKey[0], '');
      let replaceKeyStr = matchReplaceKey[0].replace(/\(|\)|\s/g, '');
      let replaceKeyArr = replaceKeyStr.split(',');
      for (let item of replaceKeyArr) {
        if (item.indexOf(':&') >= 0) {
          let splitItem = item.split(':');
          this.refReplace = this.refReplace || {};
          this.refReplace[splitItem[0]] = splitItem[1];
        }
      }
    } else {
      valueType = refString;
    }
    return valueType;
  }
}

class SuccessResponse extends Response {

  name: string = 'SuccessResponse';

  constructor (content: string) {
    super(content);
  }

}

class ErrorResponse extends Response {
  name: string = 'ErrorResponse';

  constructor (content: string) {
    super(content);
  }
}

export { SuccessResponse, ErrorResponse };