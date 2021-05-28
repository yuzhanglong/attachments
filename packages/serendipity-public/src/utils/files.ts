/*
 * File: files.ts
 * Description: 文件处理工具函数集
 * Created: 2021-1-29 11:56:38
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as fs from 'fs'
import { promisify } from 'util'
import * as path from 'path'
import { TemplateFilesMapper } from '../types'


/**
 * 写入文件树
 *
 * @author yuzhanglong
 * @param fileMap 文件名 -- 文件内容映射表
 * @return boolean 是否写入成功
 * @date 2021-1-29 11:51:38
 */
export const fileTreeWriting = (fileMap: TemplateFilesMapper): boolean => {
  if (typeof fileMap !== 'object') {
    throw new Error('fileMap 格式错误')
  }

  Object.keys(fileMap).forEach((res) => {
    if (!fs.existsSync(path.dirname(res))) {
      fs.mkdirSync(path.dirname(res))
    }
    fs.writeFileSync(res, fileMap[res])
  })
  return true
}

/**
 * 判断传入的字符串是不是合法的脚手架插件名称
 *
 * @param name 名称
 * @return {boolean} 是否合法
 * @date 2021-5-27 18:58:11
 */
export const isPlugin = (name: string): boolean => {
  return name.startsWith('serendipity-plugin-') || name.startsWith('@attachments/serendipity-plugin-')
}

export const readFilePromise = promisify(fs.readFile)

export const writeFilePromise = promisify(fs.writeFile)
