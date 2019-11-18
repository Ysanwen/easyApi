import TagInfo from './tag_info';

class Define implements TagInfo {

  name: string = "Define";
  key: string;
  error: Error = null;

  constructor (content: string) {
    let isMatch = content.match(/\S+/);
    if (isMatch) {
      let key = isMatch[0].replace(/\s/g, '');
      this.key = key;
    }
  }

}

export { Define };