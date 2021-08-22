# @attachments/proxy

用于开发的代理服务器

## Usage

以 example 目录为例：

### 启动 proxy 服务器

```bash
yarn dev:example-proxy-server
```

### 启动 web 服务器

```bash
yarn dev:example-web-server
```

### 测试

你需要信任 certificate 目录下的 CA

配置你浏览器的代理服务器，Chrome 玩家可以使用 **SwitchyOmega** 这个插件来管理代理服务器。

当访问 `baidu.com` 时，代理到 `http://localhost:8001`
当访问 `baidu.com/hello/world/xxx` 时，代理到 `http://localhost:8001/hello_world/xxx`

### 实现原理

请参考《XHR 权威指南》的如下内容：
- 第十四章第九节：通过代理以隧道形式传输安全流量
- 中间人攻击
- 第六章：代理
