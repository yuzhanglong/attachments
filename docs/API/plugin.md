# Plugin API

## 基础注解

### @Script(command)

- 参数：
    - **command**，类型为 `string`，表示该方法对应的命令。

方法注解，该方法将在用户执行 `serendipity-scripts command` 时被执行。

```typescript
class FooPlugin {
  @Script('hello')
  sayHello() {
    console.log('hello')
  }
}
```

### @Runtime()

- 参数：无

方法注解，在 `@Script` 执行前，`@Runtime` 对应的方法会被执行一次。

```typescript
class FooPlugin {
  @Runtime()
  sayHello(runtimeOption: RuntimeOptions) {
    console.log('hello')
  }
}
```

### Construction()

- 参数：无

方法注解，在构建阶段被执行。

### @Inquiry()

- 参数：无

方法注解，在 `@Construction` 执行前发起质询，它的返回值为一个 [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) 的质询数组。

### @SerendipityPlugin(name)

- 参数：name，表示 plugin 的名称，其它的插件可以通过这个名称获取本插件的实例，如果无此注解，插件名称默认为类名。

类注解，描述 plugin 的基本信息。

## 方法参数

### RuntimeOptions

- 类型：`Object`

运行时选项，持有 `@Runtime` 注解的方法可以获得这个参数，其 `API` 如下：

```typescript
export interface RuntimeOptions {
  appManager: AppManager
  scriptHooks: ScriptBaseHooks
  matchPlugin: (name: string) => PluginFactory
}
```

### RuntimeOptions.appManager

- 类型：`Object`

一个 [AppManager](API/basic?id=appmanager) 对象，管理当前目录下的配置文件（如果有的话）

### RuntimeOptions.scriptHooks

- 类型：`Object`

runtime 执行钩子（基于 `tapable`）

```typescript
class FooPlugin {
  @Runtime()
  myConstruction(options: RuntimeOptions) {
    options.scriptHooks.beforeScriptExecute.tap('my-tap', () => {
      // 在脚本即将执行时做些什么（此时位于所有 plugin 的 runtime 之后，script 执行之前）
    })
    options.scriptHooks.afterExecute.tap('my-tap', () => {
      // 在脚本执行完成之后做些什么（此时位于所有 plugin 的 runtime 之后，script 执行之前）
    })
  }
}
```

### RuntimeOptions.matchPlugin

- 类型：`(name: string) => PluginFactory`

通过 plugin 的名称来匹配 plugin 实例，从而调用其它 plugin 内部的 API。

```typescript
class HelloPlugin {
  @Runtime()
  myConstruction(options: RuntimeOptions) {
    // 拿到其他 plugin 的实例
    const helloPluginInstance = options.matchPlugin('hello-plugin')
  }
}
```

### ConstructionOptions

- 类型：`Object`

构建时选项，持有 `@Construction` 注解的方法可以获得这个参数，其 `API` 如下：

```typescript
export interface ConstructionOptions {
  appManager: AppManager
  matchPlugin: (name: string) => PluginFactory
  inquiryResult: unknown
  renderTemplate: (base: string, options?: CommonObject, target?: string) => void
}
```

### ConstructionOptions.appManager

- 类型：`Object`

见 [AppManager](API/basic?id=appmanager)

### ConstructionOptions.matchPlugin

- 类型：`(name:string) => PluginFactory`

通过 plugin 名称匹配对应的 plugin 实例

### ConstructionOptions.inquiryResult

- 类型：`object`

质询阶段的质询结果

### ConstructionOptions.renderTemplate

- 类型：`(base: string, options?: CommonObject, target?: string) => void`

拷贝模板文件到工作目录下
