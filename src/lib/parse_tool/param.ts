import TagInfo from './tag_info';

// in javascript number type conains: integer、float
// date type conains: datetime

const EffectiveValueType: string[] = [
  'string', 'number', 'integer', 'float', 'boolean', 'array', 'object', 'null', 'date', 'datetime', 'file',
  'string[]', 'number[]', 'integer[]', 'float[]', 'boolean[]', 'array[]', 'object[]', 'null[]', 'date[]', 'datetime[]', 'file[]'
];

class Param implements TagInfo {

  name: string = 'Param';
  key: string;
  valueType: string;
  refReplace: any;
  description: string;
  isRequired: boolean = true;
  error: Error = null;

  constructor (content: string) {
    let matchValue = content.match(/\{.*\}\s*/);
    if (matchValue) {
      let value = matchValue[0].replace(/\{|\}|\s/g, '');
      let valueType = value.toLocaleLowerCase();
      if (EffectiveValueType.indexOf(valueType) >= 0 || valueType.indexOf('&') >= 0) {
        this.valueType = valueType.indexOf('&') >= 0 ? this.extraRefReplaceKey(value) : valueType;
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

  extraRefReplaceKey (refString: string): string {
    let valueType = '';
    let matchReplaceKey = refString.match(/\(.*\)/g);
    if (matchReplaceKey) {
      valueType = refString.replace(matchReplaceKey[0], '');
      let replaceKeyStr = matchReplaceKey[0].replace(/\(|\)|\s/g, '');
      let replaceKeyArr = replaceKeyStr.split(',');
      for (let item of replaceKeyArr) {
        if (item.indexOf(':&') >= 0) {
          let splitItem = item.split(':');
          this.refReplace = this.refReplace || {};
          this.refReplace[splitItem[0]] = splitItem[1];
        }
      }
    } else {
      valueType = refString;
    }
    return valueType;
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

class Property extends Param {

  name: string = 'Property';

  constructor (content: string) {
    super(content);
  }

}

export { UrlParam, HeaderParam, QueryParam, BodyParam, Property }