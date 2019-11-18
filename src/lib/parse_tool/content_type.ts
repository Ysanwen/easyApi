import TagInfo from './tag_info';

const EffectiveContentType: string[] = ['application/x-www-form-urlencoded', 'multipart/form-data', 'application/json', 'text/xml'];

class ContentType implements TagInfo {

  name: string = 'ContentType';
  key: string;
  error: Error = null;

  constructor (content: string) {
    let isMatch = content.split(/\s/g);
    if (isMatch) {
      let key = isMatch[0].replace(/\s/g, '').toLocaleLowerCase();
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