
import TagInfo from './tag_info';

const EffectiveMethods: string[] = ['get', 'post', 'put', 'delete'];

class Api implements TagInfo {
  name: string = 'Api';
  method: string = 'get';
  path: string = '/';
  error: Error = null;

  constructor (content: string) {
    let testMatch = content.match(/^\S+/);
    if (testMatch) {
      let method = testMatch[0] ? testMatch[0].toLocaleLowerCase() : '';
      if (!method || EffectiveMethods.indexOf(method) < 0) {
        this.error = new Error('no effective method');
      } else {
        this.method = method;
        let rest = content.replace(testMatch[0], '');
        rest = rest.replace(/(^\s*)|(\s*$)/g, '');
        let pathMacth = rest.match(/^\S+/);
        if (!pathMacth) {
          this.error = new Error('no effective path');
        } else {
          this.path = pathMacth[0];
        }
      }
    } else {
      this.error = new Error('no effective method');
    }
  }
}

export { Api };