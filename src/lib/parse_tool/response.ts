import TagInfo from './tag_info';

class Response implements TagInfo {

  name: string = 'Response';
  description: string;
  error: Error = null;

  constructor (content: string) {
    this.description = content;
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