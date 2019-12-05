import TagInfo from './tag_info';
import splitStr from './split_str';

class Define implements TagInfo {

  name: string = "Define";
  key: string;
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    if (splitArr[0]) {
      this.key = splitArr[0];
    }
  }
}

export { Define };