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
      this.description = content.replace(replace, '')
      this.replaceWith = replace.replace(/\(|(ReplaceWith)|:|\)|\s/g,'')
    } else {
      this.description = content;
    }
  }

  appendDescription (content: string) :void {
    this.description += content;
  }
  
}

export { Deprecated };