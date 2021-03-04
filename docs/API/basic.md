# 基础 API

## PackageManager

### mergeIntoCurrent

- 类型：`(data: Object) => void`

合并配置到用户的 `package.json` 文件中，例如下面的代码为用户的工作目录下添加了一个新的依赖：

```typescript
pm.mergeIntoCurrent({
  'dependencies': {
    'foo': '1.0.0'
  }
})
```

### writePackageConfig

- 类型：`() => void`

将当前 `package.json` 写入用户文件系统中。

### installDependencies

- 类型：`() => void`

安装依赖，即执行 `yarn/npm install`

> 如果当前目录下有 `package-lock.json`，则我们使用 `npm` 否则使用 `yarn`

### removeDependency

- 类型：`(name:string) => void`

删除某个依赖，即执行 `yarn/npm remove`

## AppManager

### getAppConfig

- 类型：`() => AppConfig`

获取项目配置文件 `serendipity.js` 的内容。

### getPluginModules

- 类型：`() => PluginModuleInfo[]`

获取当前工作目录下所有的 `plugin` 信息，其中 `PluginModuleInfo` 的数据结构如下：

```typescript
// plugin 基本信息
export interface PluginModuleInfo {
  // require 的结果
  requireResult: unknown

  // 该插件的绝对路径
  absolutePath?: string

  // 额外的参数
  options?: CommonObject

  // 名称
  name?: string
}
```
