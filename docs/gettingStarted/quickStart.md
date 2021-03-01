# 快速开始

当前有两种方案来创建或者扩展已有项目：

- 使用 `preset`
- 直接安装 `plugin`

## 基于 preset 创建项目

下面我们将创建一个基于 `react` + `webpack` + `typescript` 的项目。

### 安装

```bash
npx @attachments/serendipity create hello-react -p reactApp
```

```bash
INFO 在 D:\projects\serendipity\playground\hello-react 创建项目中...

? 请选择一个开发语言 (Use arrow keys)
  JavaScript
> TypeScript
  
DONE  创建项目 hello-react 成功~, happy coding!
```

### 启动项目

```bash
cd hello-react
yarn run react-start
```

如果一切正常，控制台将会显示如下内容：

```text
 DONE  Compile successfully!
┌──────────────────────────────────────────────────┐
│                                                  │
│   ヾ(๑╹◡╹)ﾉ" 项目构建成功! (耗时：2036 ms)       │
│                                                  │
│   项目运行地址：http://127.0.0.1:9000             │
│   查看 webpack 打包分析：http://127.0.0.1:9001    │
│                                                  │
└──────────────────────────────────────────────────┘

 INFO  资源清单如下：
┌────────────────────────────────────────────┬──────────┐
│ 文件名                                     │   size   │
├────────────────────────────────────────────┼──────────┤
│ vendor-e33c22a2f273cfb63f2e79e2e5bd73ba.js │ 1.38 MB  │
├────────────────────────────────────────────┼──────────┤
│ runtime-main.js                            │ 28.21 KB │
├────────────────────────────────────────────┼──────────┤
│ main.js                                    │ --       │
└────────────────────────────────────────────┴──────────┘
```

### 打包项目

```bash
yarn run react-build
```

将获得以下结果，可以访问 `http://127.0.0.1:9001` (默认值) 来查看本次打包的分析，打包的文件在 `build` 目录下。

```bash
$ serendipity-scripts run react-build
Webpack Bundle Analyzer is started at http://127.0.0.1:9001
Use Ctrl+C to close it
```

> 更多配置请参考 @attachments/serendipity-plugin-react

## 基于 plugin 扩展已有项目

下面以 `eslint` 为例，通过脚手架来初始化开箱即用的 eslint 配置。

### 安装

```bash
cd /your/project/base/dir
npx @attachments/serendipity add @attachments/serendipity-plugin-eslint
```

```bash
INFO 添加插件 @attachments/serendipity-plugin-eslint 中...

? 请选择你的开发环境 (Use arrow keys)
   React
> 其他项目

? 是否添加 typescript 解析支持 (y/N)
? 选择一个 eslint 规范 recommend

INFO 插件 @attachments/serendipity-plugin-eslint 安装成功!
INFO 正在移除无关的依赖...
INFO 移除成功!
```

### lint 代码

执行下面的命令即可 lint 代码：

```bash
yarn run lint
```

它等价于以下命令，你也可以进入 `package.json` 修改之：

```bash
eslint --ext .js --ext .jsx --max-warnings 0 ./src
```

> 更多配置请参考 @attachments/serendipity-plugin-eslint
