import TagInfo from './tag_info';

class Version implements TagInfo {
  name: string = 'Version';
  key: string;

  constructor (content: string) {
    let matchVersion = content.match(/^\S+/);
    this.key = matchVersion ? matchVersion[0] : ''; 
  }
}

export { Version };