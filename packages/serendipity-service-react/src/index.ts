import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'


module.exports = ({ operations }: ServiceOption) => {
  operations.runPluginTemplate(require('@attachments/serendipity-plugin-react'))

  // // 执行插件配置
  // const onRunPlugins = async () => {
  //   const fsResults = {}
  //
  //   // TODO: 自动化读取 plugin，这里先拿一个 plugin 来测试
  //   const reactPluginTemplate = require('../cli-plugin-react').template
  //
  //   // TODO：下面的钩子都可以进行封装
  //
  //   // 模板拷贝
  //   const copyTemplate = async (templatePath, opt) => {
  //
  //     const totalFiles = await globby(
  //       ['**/*'],
  //       {
  //         cwd: templatePath,
  //         dot: true
  //       }
  //     )
  //     for (let file of totalFiles) {
  //       const base = path.resolve(templatePath, file)
  //       const content = await readFilePromise(base)
  //
  //       // TODO: 基于 ejs 模板语法替换内容
  //       const target = path.resolve(options.basePath, file)
  //
  //       // 将文件内容保存到一个对象中，最后一次性处理
  //       fsResults[target] = content.toString()
  //     }
  //   }
  //   fileTreeWriting(fsResults)
}

