import TagInfo from './tag_info';
import splitStr from './split_str';

class Reuse implements TagInfo {

  name: string = "Reuse";
  key: string;
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    splitArr[0] && (this.key = splitArr[0]);
  }

}

export { Reuse };