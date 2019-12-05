import TagInfo from './tag_info';
import splitStr from './split_str';

class Name implements TagInfo {
  
  name: string = 'Name';
  key: string;
  description: string;
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    let name = splitArr[0];
    let description = splitArr[1];
    if (name) {
      this.key = name;
      this.description = description;
    } else {
      this.error = new Error("Name can not be empty")
    }
  }

}

export { Name };