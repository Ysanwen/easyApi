import TagInfo from './tag_info';
import splitStr from './split_str';

class Group implements TagInfo{
  name: string = 'Group';
  key: string;
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    this.key = splitArr[0] || 'default';
  }
}

export { Group };