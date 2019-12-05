import TagInfo from './tag_info';
import splitStr from './split_str';

class Version implements TagInfo {
  name: string = 'Version';
  key: string;

  constructor (content: string) {
    let matchVersion = splitStr(content);
    this.key = matchVersion ? matchVersion[0] : ''; 
  }
}

export { Version };