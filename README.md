# next-cssr
一个基于next.js框架的同构项目。可在服务器过载的情况下，自动降级为客户端渲染，降低服务器压力。当降级为客户端渲染时，相当于静态资源服务器一样。

**可访问 [nextjs.org/learn](https://nextjs.org/learn) 开始学习 Next.js.**

- [怎么使用](#how-to-use)
  - [安装](#setup)
  - [自定义配置](#custom-configuration)
  - [config装饰器](#page-config)
  - [降级方式](#downgrade)
 
- [项目部署](#production-deployment)

<a id="how-to-use" style="display: none"></a>

## 怎么使用

<a id="setup" style="display: none"></a>

### 安装

在项目文件夹中运行:

```bash
npm install --save next-cssr
```

新建 `./server/index.js` 文件

```javascript
const path = require('path');
const startServer = require('next-cssr').default;

const dev = process.env.NODE_ENV !== 'production';
const dir = path.resolve(__dirname, '../');

startServer({ dev, dir })
  .then(async (app) => {
    await app.prepare();
  })
  .catch((err) => {
    console.log('server-start-err: ', err);
  });

```
startServer 的 API 如下所示：
- dev (boolean) 判断 Next.js 应用是否在开发环境 - 默认false
- dir (string) Next 项目路径 - 默认'.'
- quiet (boolean) 是否隐藏包含服务端消息在内的错误信息 - 默认false
- conf (object) 与next.config.js的对象相同 - 默认{}
- port (number) 应用启动的端口，默认3000
- downgradeStrategy (function) 自定义服务器负载降级策略，不传采用系统默认降级策略


新建 `./pages/_document.js` 文件
```javascript
import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { requestOnDowngrade } from 'next-cssr/lib';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    let pageInitialProps = {};
    const initialProps = await Document.getInitialProps(ctx);
    // prefetchAPIConfig 为降级页面请求api配置，不可缺少这一步
    return { ...initialProps, prefetchAPIConfig: ctx.prefetchAPIConfig };
  }

  render() {
    const { html, prefetchAPIConfig } = this.props;
    return (
      <html>
        <Head>
          {this.props.styleTags}
          <!--- requestOnDowngrade 为降级页面客户端发起请求动作 -->
          <script dangerouslySetInnerHTML={{ __html: requestOnDowngrade(prefetchAPIConfig) }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
```

将下面脚本添加到 package.json 中:

```json
{
  "scripts": {
    "dev": "node server.js",
  }
}
```

即可启动开发。

<a id="custom-configuration" style="display: none"></a>

## 自定义配置

自定义配置基于nextjs的自定义文件，做了一些扩展。如下：
```javascript
const path = require('path');

module.exports = {

  // mode export为客户端渲染， ssr为服务器渲染
  mode: process.env.NODE_ENV !== 'production' ? 'export' : 'ssr',

  // 开发环境代理，配置参考 http-proxy-middleware 插件：https://github.com/chimurai/http-proxy-middleware。
  // 可配置多个
  devServerProxy: {
    '/api': {
      target: 'http://example.cn',
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
      secure: false,
    },
  },
};

```
<a id="page-config" style="display: none"></a>

## config 装饰器

config 装饰器支持传入对象或函数
- 传入对象时，只能传入页面配置，目前支持prefechAPI和loading。
  - prefechAPI为服务端请求接口，降级时，在客户端请求，请求结果可以通过配置的key在页面props中获得
  - loading为页面prefechAPI请求未完成之前展示的自定义loading页面。只在降级到客户端渲染时有用。loading类型为react组件。不传将展示系统默认loading。

- 传入函数时，函数必须返回一个数组，且数组第一项必须为页面配置。后面每项将当作每个装饰器，应用在页面上。

```javascript
import React from 'react';
import { config } from 'next-cssr/lib';
import '@babel/polyfill';

@config({
  prefetchAPI: {
    getList: {
      type: 'get',
      url: '/api/public/index',
    }
  }
})
class Index extends React.Component {
  constructor(props) {
    super(props);
    // 可通过 props.getList 获取config中prefetchAPI的结果
  }

  render() {
    return (
      <div>hello</div>
    );
  }
}
export default Index;
```

<a id="downgrade" style="display: none"></a>

## 降级方式

一共有四种情况可以降级，前面两种可人为控制。
- 浏览器页面路径传入参数 &downgrade_to_export=1
- next.config.js 配置mode为export
- 服务器过载降级
- 页面渲染时间超过2.5秒降级

<a id="production-deployment" style="display: none"></a>

## 项目部署

将下面脚本添加到 package.json 中:
```json
{
  "scripts": {
    "build": "npm run build && npm run export && NODE_ENV=production node server/index.js",
    "build": "next build",
    "export": "next export"
  }
}
```

执行 `npm run build` 即可