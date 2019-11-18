import TagInfo from './tag_info';

class Name implements TagInfo {
  
  name: string = 'Name';
  key: string;
  description: string;
  error: Error = null;

  constructor (content: string) {
    let macthName = content.match(/\S+/);
    if (macthName) {
      this.key = macthName[0].replace(/\s/g, '');
      this.description = content.replace(macthName[0], '').replace(/(^\s*)|(\s*$)/g, '');
    } else {
      this.error = new Error("Name can not be empty")
    }
  }

}

export { Name };