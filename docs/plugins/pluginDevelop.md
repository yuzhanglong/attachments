# 插件开发

## 安装与初始化

执行下面的命令初始化一个 `serendipity-plugin` 模板：

```bash
mkdir my-plugin-dir
cd my-plugin-dir
npx @attachments/serendipity add @attachments/serendipity-plugin-init --delete
```

你会得到以下目录结构：

![](http://cdn.yuzzl.top/blog/20210301233640.png)

其中 `myPlugin.ts` 初始内容如下，下面将逐一介绍：

```typescript
import { Construction, Inquiry, Runtime, Script, SerendipityPlugin } from '@attachments/serendipity-scripts'
import { ConstructionOptions, RuntimeOptions } from '@attachments/serendipity-scripts/bin/types/pluginExecute'


@SerendipityPlugin('my-plugin')
class MyPlugin {
  @Construction()
  myConstruction(options: ConstructionOptions) {
    // 在构建模式下做些什么
  }

  @Runtime()
  myRuntime(options: RuntimeOptions) {
    // 在 runtime 模式下做些什么
  }

  @Inquiry()
  myInquiry() {
    // 发起质询
    return []
  }

  @Script('hello-world')
  myScript() {
    // 在用户执行 serendipity-scripts hello-world 之后 做些什么
  }
}

export default MyPlugin
```

## @Construction()

为 plugin 的一个或多个方法打上 `@Construction()` 注解，那么这些方法会在构建时 (即执行 `serendipity add your-plugin-name` 时)
执行，在此阶段，你可以渲染相关模板、或者更新 `package.json` 的配置，下面是一个例子：

```typescript
class FooPlugin {
  @Construction()
  myConstruction(options: ConstructionOptions) {
    // 复制模板，将 plugin根目录/templates/hello-world 的所有内容复制到当前项目根目录下
    options.renderTemplate('hello-world')

    // 修改 package.json 配置
    options.appManager.packageManager.mergeIntoCurrent({
      // 添加一个依赖 -- axios
      dependencies: {
        axios: 'latest'
      },
      // 写入一些脚本
      scripts: {
        'say-hello': 'echo hello'
      }
    })

    // 获得 hello-plugin 的实例
    const instance = options.matchPlugin('hello-plugin')

    // 打印质询结果
    console.log(options.inquiryResult)
  }
}
```

> `ConstructionOptions` 的详细内容请参考 API 一节

## @Inquiry()

在 plugin Construction 方法执行前发起质询，质询结果可以通过 `ConstructionOptions.inquiryResult` 得到。

为 plugin 的某个方法打上 `@Inquiry` 注解，则这个方法需要返回一个基于 [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) 的质询数组。

下面的代码会在构建时询问用户选择一个开发语言，开发者在 `@Construction()` 注解下的方法中可以拿到用户的答案。

```typescript
class HelloPlugin {
  @Inquiry()
  reactProjectInquiry() {
    return [
      {
        type: 'list',
        message: '请选择一个开发语言',
        name: 'language',
        choices: [
          'JavaScript',
          'TypeScript'
        ],
        default: 'JavaScript'
      }
    ]
  }

  @Construction()
  myConstruction(options: ConstructionOptions) {
    if (options.inquiryResult.language === 'TypeScript') {
      console.log("用户选择了 typescript！")
    } else {
      console.log("用户选择了 JavaScript！")
    }
  }
}
```

## @Script(command)

为 plugin 的某个方法打上 `@Script(command)` 注解，则用户执行 `serendipity-script command` 就可以执行这个方法，来看下面的代码：

```typescript
class HelloPlugin {
  @Script('react-start')
  reactStart() {
    // TODO: 启动 webpack 、devserver
    console.log("react 项目启动啦~")
  }

  @Script('react-build')
  reactBuild() {
    // TODO: ....
    console.log("react 项目打包啦~")
  }
}
```

当这个插件安装之后，脚手架内部会自动安装 `serendipity-scripts` 依赖、以及相应的 script 字段。

上面的插件安装后将使 `package.json` 发生以下改变：

```bash
{
  "name": "your-name",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
+   "@attachments/serendipity-plugin-hello": "latest",
+   "@attachments/serendipity-scripts": "latest"
  },
  "scripts": {
+    "react-start": "serendipity-scripts react-start",
+    "react-build": "serendipity-scripts react-build"
  }
}

```

## @Runtime()

为 plugin 的某个方法打上 `@Runtime` 注解，则任一 `@Script` 注解的方法被执行前，都会执行这个方法：

```typescript
class HelloPlugin {
  @Runtime()
  myConstruction(options: RuntimeOptions) {
    // 拿到其他 plugin 的实例
    const helloPluginInstance = options.matchPlugin('hello-plugin')

    // 执行 脚手架内部的生命周期钩子
    options.scriptHooks.beforeScriptExecute.tap('my-tap', () => {
      // 在脚本即将执行时做些什么（此时位于所有 plugin 的 runtime 之后，script 执行之前）
    })
    options.scriptHooks.afterExecute.tap('my-tap', () => {
      // 在脚本执行完成之后做些什么（此时位于所有 plugin 的 runtime 之后，script 执行之前）
    })

    // 获取 AppManager 实例（见 API 文档）
    console.log(options.appManager)
  }
}
```


