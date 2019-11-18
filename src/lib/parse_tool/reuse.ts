import TagInfo from './tag_info';

class Reuse implements TagInfo {

  name: string = "Reuse";
  key: string;
  error: Error = null;

  constructor (content: string) {
    let isMatch = content.match(/^\S+\s*/);
    if (isMatch) {
      let key = isMatch[0].replace(/\s/g, '');
      this.key = key;
    }
  }

}

export { Reuse };