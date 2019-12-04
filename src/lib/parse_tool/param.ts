import TagInfo from './tag_info';

const EffectiveValueType: string[] = ['string', 'number', 'boolean', 'array', 'object', 'null', 'date'];

class Param implements TagInfo {

  name: string = 'Param';
  key: string;
  valueType: string;
  description: string;
  isRequired: boolean = true;
  error: Error = null;

  constructor (content: string) {
    let matchValue = content.match(/\{.*\}\s*/);
    if (matchValue) {
      let value = matchValue[0].replace(/\{|\}|\s/g, '').toLocaleLowerCase();
      if (EffectiveValueType.indexOf(value) >= 0) {
        this.valueType = value;
        let restStr = content.replace(matchValue[0], '');
        let paramsKeyMatch = restStr.match(/^\S+\s*/);
        if (paramsKeyMatch) {
          this.key = paramsKeyMatch[0] ? paramsKeyMatch[0].replace(/\s/g, '') : '';
          if (this.key.indexOf('[') >= 0 && this.key.indexOf(']') >= 0) {
            this.isRequired = false;
            this.key = this.key.replace(/\[|\]/g, '');
          }
          this.description = restStr.replace(paramsKeyMatch[0], '');
        }
        if (!this.key) {
          this.error = new Error(`${this.name} must has a param`)
        }
      } else {
        this.error = new Error(`${this.name} has unsupport type: "${value}"`)
      }
    } else {
      this.error = new Error(`${this.name} must has a param type`)
    }
  }

  appendDescription (content: string) :void {
    this.description += content;
  }

}

class UrlParam extends Param {
  
  name: string = 'UrlParam';

  constructor (content: string) {
    super(content);
  }

}

class HeaderParam extends Param {

  name: string = 'HeaderParam';

  constructor (content: string) {
    super(content);
  }

}

class QueryParam extends Param {

  name: string = 'QueryParam';

  constructor (content: string) {
    super(content);
  }
}

class BodyParam extends Param {

  name: string = 'BodyParam';

  constructor (content: string) {
    super(content);
  }

}

export { UrlParam, HeaderParam, QueryParam, BodyParam }