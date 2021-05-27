/*
 * File: template.ts
 * Description: 模板处理工具函数
 * Created: 2021-1-29 12:25:18
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import * as globby from 'globby'
import { BaseObject, TemplateFilesMapper } from '../types'
import { fileTreeWriting, readFilePromise } from './files'


/**
 * 获取模板数据，并转换成 目标路径 -- 文件内容的形式
 *
 * @author yuzhanglong
 * @param templateBasePath 模板根路径
 * @param targetBasePath 目标根路径
 * @date 2021-1-29 11:51:42
 */

const getTemplatesData = async (templateBasePath: string, targetBasePath: string): Promise<TemplateFilesMapper> => {
  const fsResults = {}
  // 拿到 template 根路径下的所有文件 包括目录
  const totalFiles = await globby(
    ['**/*'],
    {
      cwd: templateBasePath,
      dot: true
    }
  )

  for (const file of totalFiles) {
    const base = path.resolve(templateBasePath, file)
    const content = await readFilePromise(base)
    const target = path.resolve(targetBasePath, file)

    // 将文件内容保存到一个对象中，最后一次性处理
    fsResults[target] = content.toString()
  }

  return fsResults
}

/**
 * 基于 ejs 渲染 目标路径 -- 文件内容 映射表中的文件内容
 *
 * @author yuzhanglong
 * @param data 目标路径 -- 文件内容 映射表
 * @param options ejs 配置
 * @date 2021-1-29 12:35:22
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderTemplateData = (data: TemplateFilesMapper, options: unknown): void => {
  // TODO: 基于 ejs 渲染数据
}

/**
 * 渲染并写入模板
 *
 * @author yuzhanglong
 * @param base 要写入的绝对路径
 * @param options ejs 选项
 * @param target 目标路径
 * @date 2021-1-29 13:33:43
 */
const renderTemplate = async (base: string, options?: BaseObject, target?: string): Promise<void> => {
  // 获取映射表
  const filesMapper = await getTemplatesData(base, target)

  // TODO: 渲染模板数据
  renderTemplateData(filesMapper, options || {})

// 模板拷贝
  await fileTreeWriting(filesMapper)
}


export {
  renderTemplate,
  getTemplatesData,
  renderTemplateData
}
