
import TagInfo from './tag_info';
import splitStr from './split_str';

const EffectiveMethods: string[] = ['get', 'post', 'put', 'delete', 'patch'];

class Api implements TagInfo {
  name: string = 'Api';
  method: string = 'get';
  path: string = '/';
  error: Error = null;

  constructor (content: string) {
    let splitArr = splitStr(content);
    let method = splitArr[0].toLocaleLowerCase();
    if (!method || EffectiveMethods.indexOf(method) < 0) {
      this.error = new Error('no effective method');
    } else {
      this.method = method;
      let rest = splitArr[1];
      rest = rest.replace(/(^\s*)|(\s*$)/g, '');
      let path = splitStr(rest)[0];
      if (!path) {
        this.error = new Error('no effective path');
      } else {
        this.path = path;
      }
    }
  }
}

export { Api };