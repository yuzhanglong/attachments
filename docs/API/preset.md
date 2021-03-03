# Preset API

一个 `preset` 可以是：

- preset 对象
- 返回 preset 对象的函数

## Preset 对象

### plugins

- 类型：`Array<PresetPlugin>`
- 默认值：`[]`

将要被安装的插件的信息。

> TIP：一个 `preset` 至少包含一个 `plugin`

### initialDir

- 类型：`boolean`
- 默认值：`true`

安装时在新目录下创建，如果用户没有指定目录名称，则使用 `initialDirDefaultName` 字段值。

### initialDirDefaultName

- 类型：`string`
- 默认值：`serendipity-app`

当用户没有指定目录名称，使用这个值。

## PresetPlugin

### name

- 类型：`string`

plugin 名称。

### path

- 类型：`string`
- 默认值：`''`

plugin 所在的本地路径。

### version

- 类型：`string`
- 默认值：`latest`

要安装的 plugin 版本，默认为 `latest`。

### removeAfterConstruction

- 类型：`boolean`
- 默认值：`false`

是否在构建阶段结束之后移除该插件。

### overrideInquiries

- 类型：`object`
- 默认值：`{}`

跳过插件的一个或多个质询，并以默认值代替。

例如下面的质询对象：

```javascript
const inquiryObjects = [
  {
    type: 'list',
    name: 'language',
    message: '请选择一个开发语言？',
    default: 'typescript'

  },
  {
    type: 'list',
    name: 'loveNode',
    message: '你喜欢 node.js 吗？',
    default: true
  }
]
```

当你设置 `overrideInquiries` 为下面的值：

```javascript
const res = {
  language: 'javascript'
}
```

那么 `name` 为 `language` 的质询将被跳过，且其最终的质询结果为 `javascript`。



