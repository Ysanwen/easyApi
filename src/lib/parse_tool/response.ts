import TagInfo from './tag_info';
import splitStr from './split_str';

const contentTypeReg = /(audio)|(application)|(video)|(image)|(text)|(font)\//;

class Response implements TagInfo {

  name: string = 'Response';
  description: string;
  responseType: string;
  responseCode: number;
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
    if (/^\d+$/.test(restArr[0])) {
      this.responseCode = parseInt(restArr[0]);
      this.description = restArr[1];
    } else {
      this.description = rest;
    }
  }

  appendDescription (content: string) :void {
    this.description += content;
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