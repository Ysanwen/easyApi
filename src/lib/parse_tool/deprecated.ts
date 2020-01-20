import TagInfo from './tag_info';

class Deprecated implements TagInfo {

  name: string = 'Deprecated';
  description: string;
  replaceWith: string;
  error: Error = null;

  constructor (content: string) {
    let hasReplace = content.match(/\(\s*ReplaceWith.*\)/)
    if (hasReplace) {
      let replace = hasReplace[0]
      this.replaceWith = replace.replace(/\(|(ReplaceWith)|:|\)|\s/g,'');
      this.description = content.replace(replace, `(${this.replaceWith})`);
    } else {
      this.description = content;
      this.replaceWith = '';
    }
  }

  appendDescription (content: string) :void {
    this.description += content;
  }
  
}

export { Deprecated };