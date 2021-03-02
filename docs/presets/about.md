# 预设 (Presets)

预设可以组织多个插件让它们协同工作。例如一个 React 项目我们需要添加 eslint 支持，那么可以有一个 `react plugin` + `eslint plugin` 的预设。

通过预设，我们可以:

- 提高插件的复用率。
- 降低多个模块的耦合度。
- 通过插件间的自由组合，提高项目创建的多样性。

## 基本结构

一个预设可以是一个返回预设对象的函数，或者一个预设对象。

下面的代码是一个预设对象文件案例，在脚手架运行时，`serendipity-plugin-react` 和 `serendipity-plugin-babel` 将会被安装：

```javascript
const path = require('path')

module.exports = {
  plugins: [
    {
      name: '@attachments/serendipity-plugin-react',
    },
    {
      name: '@attachments/serendipity-plugin-babel'
    }
  ]
}
```

当然，也可以是一个函数，支持异步调用，下面的代码将在打印 `hello world` 之后安装两个 plugin：

```javascript
module.exports = () => {
  console.log('hello world')
  return {
    plugins: [
      {
        name: '@attachments/serendipity-plugin-react'
      },
      {
        name: '@attachments/serendipity-plugin-babel'
      }
    ]
  }
}
```

不难看出，函数式的 `preset` 拥有更强的定制能力，它可以根据用户传入的参数、或者通过命令行和用户交互，来选择最终返回的预设。

> 关于预设的更多参数请参考 API 一节。
