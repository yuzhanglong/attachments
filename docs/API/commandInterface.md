# 命令行接口

## CLI

### 概览

```text
Usage: serendipity [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  create [options] [app-name]  基于 preset 创建一个前端项目/初始化模板
  add [options] [plugin-name]  添加一个插件
  help [command]               display help for command
```

### serendipity create [app-name]

```text
基于 preset 创建一个前端项目/初始化模板

Options:
-g --git               初始化 git (default: false)
-c --commit <message>  初始化 commit 信息，只有选择初始化 git 时有效 (default: "initial commit")
-p --preset <preset>   选择一个创建预设 (preset)，可以是本地文件或者 http 链接
```

> 如果 `create` 后跟随字符串，例如 `serendipity create foo`，那么工作目录为 `执行命令的目录/foo`，新的目录会被自动创建。

### serendipity add

```text
添加一个插件

Options:
  -v --version <version>      plugin 版本，默认为 latest
  -l --localPath <localPath>  plugin 本地路径，追加此选项时 -v 会被忽略
  -d --delete                 在安装完成之后移除 plugin (用于面向一些只负责构建功能的 plugin)
  -h, --help                  display help for command
```

> 对于一些只在构建过程起作用的插件，我们可以加上 `-d / --delete` 命令在安装完成之后移除之

## serendipity-scripts

```text
Usage: starter [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  run [command]   执行某个命令
  help [command]  display help for command
```
