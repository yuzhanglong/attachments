# @attachments/serendipity-plugin-react

## 概述

提供封装好的 react 服务 (基于 `webpack 5`)，包括开发与构建。

## 安装

```bash
npx @attachments/serendipity add @attachments/serendipity-plugin-react
```

## scripts

### react start

启动 webpack-dev-server (开发环境，支持热更新)

### react build

打包项目 (生产环境)

## 参数

```typescript
interface ReactPluginOptions {
  // webpack 配置
  webpackConfig?: WebpackConfiguration

  // dev server 配置
  devServerConfig?: WebpackDevServerConfiguration

  // 端口
  port?: number

  // host
  host?: string

  // webpack analysis port
  analysisPort?: number
}
```

## For Other Plugins

下面的 `pluginInstance` 表示插件实例，你可以在其它插件的 runtime 方法下通过以下方法获取：

```typescript
class FooPlugin {
  @Runtime()
  initBabelForReactProject(options: RuntimeOptions) {
    const plugin = options.matchPlugin('serendipity-react-plugin')
    const instance: SerendipityReactPlugin = plugin.getPluginInstance() as SerendipityReactPlugin
    if (instance) {
      // do something....
    }
  }
}
```

### API

**pluginInstance.reactServiceHooks**

生命周期钩子

```typescript
// 合并 webpack 配置
instance.reactServiceHooks.beforeWebpackStart.tap('foo', (mergeFn) => {
  mergeFn({
    // 要合并的 webpack 配置
  })
})

instance.reactServiceHooks.beforeDevServerStart.tap('foo', (mergeFn) => {
  mergeFn({
    // 要合并的 webpack-dev-server 配置
  })
})
```

### 案例

下面的案例添加了 `HtmlWebpackPlugin` 到 webpack 配置中：

```typescript
class FooPlugin {
  @Runtime()
  initBabelForReactProject(options: RuntimeOptions) {
    const plugin = options.matchPlugin('serendipity-react-plugin')
    const instance: SerendipityReactPlugin = plugin.getPluginInstance() as SerendipityReactPlugin
    if (plugin && instance) {
      instance.reactServiceHooks.beforeWebpackStart.tap('webpackMerge', (mergeFn) => {
        mergeFn({
          plugins: [
            new HtmlWebpackPlugin()
          ]
        })
      })
    }
  }
}
```

