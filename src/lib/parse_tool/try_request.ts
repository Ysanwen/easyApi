import TagInfo from './tag_info';

class TryRequest implements TagInfo {

  name: string = 'TryRequest';
  tryRequest: boolean;
  description: string;
  error: Error = null;

  constructor (content: string) {
    this.description = content.replace(/^\s+|\s+$/g, '');
    if (this.description.indexOf('false') >= 0) {
      this.tryRequest = false;
    } else {
      this.tryRequest = true;
    }
  }
}

export { TryRequest };