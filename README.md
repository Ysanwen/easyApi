### 简介

eazyApi是通过注释生成api文档的命令行工具，基于nodejs开发。通过提取源文件中的注释文档部分(根据指定格式的注释：以@ApiStart开始，至@ApiEnd结束)，生成对应API文档。可供在线预览及调试，支持get、post、put、delete、patch等ajax请求。并集成一个内部的静态文件服务器，同时可设置proxy代理，方便进行api相关的调试。

通过npm 安装

```
npm install https://github.com/Ysanwen/easyApi.git#dev -g
```

安装成功后，通过命令行参数-V查看版本:

```bash
easyApi -v 
# 0.0.1
```

出现版本号，表示已安装成功。[具体使用，请参考](https://ysanwen.github.io/easyApi/index.html)


### License (MIT)

Code and documentation copyright 2020 Ysanwen. Code released under the [MIT license][mit-url]

[mit-url]: https://github.com/FezVrasta/popper.js/blob/master/LICENSE.md