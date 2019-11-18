import TagInfo from './tag_info';

class Group implements TagInfo{
  name: string = 'Group';
  key: string;
  error: Error = null;

  constructor (content: string) {
    let splitArr = content.split(/\s+/g);
    this.key = splitArr[0] || 'default';
  }
}

export { Group };