# 插件 (Plugins)

插件是本脚手架工具的核心部分。一个插件可以具备多种能力，请看下面介绍。

## 概念

### Name 名称

每个插件都有一个模块名称，必须以 `serendipity-plugin-` 开头、或者以 `@attachments/serendipity-plugin-` 开头，这是脚手架实现某些功能(如在当前项目下搜索所有插件) 的必要条件。

### Construction (构建)

所谓构建就是通过用户给予的信息，拉取模板或者修改配置，这是一个一次性的操作。

例如一个 react 项目，我们在构建过程中会自动生成如下内容：

![](http://cdn.yuzzl.top/blog/20210301152054.png)

通过合适的开发模板，我们可以减少大量重复的 Ctrl + C/V 逻辑，而且，构建之前我们还可以发起质询，例如，让用户选择是 `ts` 还是 `js`，从而向主目录中写入合适的文件。

另外，如果一个插件只有构建模块，那么构建完成之后它会被**自动删除**，避免多余的依赖。

### Inquiry (质询)

插件可以在构建前质询用户（如让用户选择开发语言等一些个性化的内容），我们可以更加优雅地处理构建流程的输出。

### Script (服务脚本)

用过 `create-react-app` 的同学都知道，它将 webpack 打包等一系列逻辑全部封装到了 `react-scripts` 这个模块中，通过一个命令行接口 `react-script start` 让用户启动开发服务器。

受此思路影响，我为插件增加了 Script 功能，每个 Script 功能对应一个命令，每当这个命令被调用，那么就会自动启动相应的服务。

下图是 react-plugin 安装后的 `package.json` 内容：

```json
{
  "name": "serendipity-project",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@attachments/serendipity-plugin-babel": "latest",
    "@attachments/serendipity-plugin-react": "latest",
    "@attachments/serendipity-scripts": "latest",
    "@types/node": "^12.0.0",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "eslint": "^7.19.0",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "typescript": "^4.1.3"
  },
  "babel": {
    "presets": [
      "@babel/preset-react",
      "@babel/preset-typescript"
    ]
  },
  "scripts": {
    "react-start": "serendipity-scripts run react-start",
    "react-build": "serendipity-scripts run react-build"
  }
}
```

`serendipity-plugin-react` 中有两个 **Script** 逻辑，分别对应 `react-start` / `react-build` 命令。

基于 `serendipity-scripts` 模块，当用户执行 `yarn run react-start`，即执行 `serendipity-scripts run react-start`，`serendipity-scripts`
模块就会去搜索该项目下所有的 plugins，通过传入的命令匹配插件内部对应的方法，然后执行之。

### Runtime (运行时)

插件的 `Runtime` 会在 `Script` 服务执行前被执行一次，在 `Runtime` 过程中，我们可以通过调用其他插件提供的
API，扩展它的执行流程。（基于 [tapable](https://github.com/webpack/tapable) 模块，如果用过 webpack 应该不会陌生）

例如： `react-plugin` 提供了一个 webpack 构建前的钩子，通过它，其它的插件可以在 runtime 阶段向它合并入额外的 webpack 配置。

## 开发一个插件

[点击此处](plugins/pluginDevelop.md) 查看相关文档。

