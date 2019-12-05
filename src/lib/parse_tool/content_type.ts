import TagInfo from './tag_info';
import splitStr from './split_str';

const EffectiveContentType: string[] = ['application/x-www-form-urlencoded', 'multipart/form-data', 'application/json', 'text/plain'];

class ContentType implements TagInfo {

  name: string = 'ContentType';
  key: string;
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    let key = splitArr[0];
    if (key) {
      key = key.toLocaleLowerCase();
      if (EffectiveContentType.indexOf(key) >= 0) {
        this.key = key;
      } else {
        this.error = new Error(`the request content type: ${key} is invalid`)
      }
    } else {
      this.key = 'application/json'
    }
  }

}

export { ContentType };