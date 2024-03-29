# @attachments/proxy

为前端开发者准备的代理服务器

## 快速开始

**安装并配置浏览器插件**

SwitchyOmega 是一个知名的浏览器代理工具，它可以将浏览器的 http 请求全部重定向到你本地的代理工具上（只负责请求重定向，其本身没有代理功能）。

[下载地址](https://github.com/FelisCatus/SwitchyOmega/releases/tag/v2.5.20) （GitHub Release）

插件安装完成之后，打开设置页面，新建情景模式，按照如下的方法配置，确认无误后保存，不代理的地址列表保持默认即可：

![插件使用](https://user-images.githubusercontent.com/56540811/137702382-1ec43265-4b35-4d48-8154-09bb0b65bef4.png)

**安装依赖**

```bash
yarn add @attachments/proxy

# or npm install @attachments/proxy
```

**编写规则**

在工作目录下新建一个 `proxy.js` 文件（名称随意），使用下面的代码：

```typescript
import { ProxyServer } from '@attachments/proxy';

async function runApp() {
  const server = new ProxyServer();
  server.addRule(
    'proxy.yuzzl.top',
    {
      location: '/',
      // 当访问 proxy.yuzzl.top 时，代理到 http://localhost:8001
      proxyPass: 'http://localhost:8001',
    },
    {
      // 当访问 proxy.yuzzl.top/hello/world/xxx 时，代理到 http://localhost:8001/hello_world/xxx
      location: '/hello/world',
      proxyPass: 'http://localhost:8001/hello_world',
    },
  );

  await server.initServers();
  await server.listen();
}

runApp().catch(e => {
  console.log(e);
});
```

启动项目

```bash
node proxy.js
```

接下来：

- 当你访问 `proxy.yuzzl.top`，会将请求代理到 `http://localhost:8001`

- 当你访问 `proxy.yuzzl.top/hello/world/xxx`，会将请求代理到 `http://localhost:8001/hello_world/xxx`


## 常见问题

### HTTPS 环境下浏览器提示不安全

proxy 内置了一个根证书，位于 package 的 `certificate` 目录下，你需要让你的计算机信任 `rootCA.pem`：

#### macOS 系统

- 请在 Finder 中打开该目录，可以进入 node_modules 找到它。

![image](https://user-images.githubusercontent.com/56540811/137639025-b333694d-5980-4aaf-a069-46a68ec4e46a.png)


- 双击 `rootCA.pem`，将证书导入到钥匙串，如图所示：

![image](https://user-images.githubusercontent.com/56540811/137638859-a3b8c2d3-9f72-4a1e-ad0d-019cc7100375.png)

- 双击该证书，打开信任选项，设置为始终信任。

![image](https://user-images.githubusercontent.com/56540811/137638923-d2cbe734-68c0-4505-917e-428e71469976.png)

#### window 系统

本人无 window 电脑，待补充...

### 它是如何工作的？

请参考《HTTP 权威指南》的如下内容：

- 第十四章第九节：通过代理以隧道形式传输安全流量
- 中间人攻击
- 第六章：代理

具体实现原理不久我会写一篇文章来讲解
