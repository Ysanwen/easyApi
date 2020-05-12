import TagInfo from './tag_info';

class Description implements TagInfo {

  name: string = 'Description';
  description: string;
  error: Error = null;

  constructor (content: string) {
    this.description = content.replace(/^\s+|\s+$/g, '');
  }

  appendDescription (content: string) :void {
    this.description += `${this.description ? '\n' : ''}content`;
  }

}

export { Description };