/*
 * File: presetManager.ts
 * Description: 预设管理类
 * Created: 2021-2-24 22:12:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'
import { SerendipityPreset } from '../types/preset'
import { DEFAULT_PRESET_NAME, DEFAULT_PROJECT_NAME, PRESET_CDN_BASE_URL } from '../common/constant'
import { writeFilePromise } from './files'
import logger from './logger'

class PresetManager {
  private readonly basePath: string
  private preset: SerendipityPreset

  constructor(basePath?: string) {
    this.basePath = basePath
    this.preset = {
      initialDir: true,
      initialDirDefaultName: DEFAULT_PROJECT_NAME,
      plugins: []
    }
  }

  /**
   * 直接使用 preset object 来初始化项目 preset
   *
   * @author yuzhanglong
   * @param preset 对象
   * @date 2021-2-24 22:00:04
   */
  public initPresetByObject(preset: SerendipityPreset) {
    this.preset = preset
  }

  /**
   * 通过一个 preset url 来初始化项目 preset
   *
   * @author yuzhanglong
   * @param preset 可选的 preset，是个对象，如果没有传入这个参数，我们会通过网络请求拿到这个 preset
   * @param tempPath preset 所保存的临时目录
   * @date 2021-2-21 11:46:48
   */
  public async initPresetByUrl(preset: string, tempPath?: string) {
    let presetTmp

    if (!preset) {
      logger.error('不合法的 preset, preset 的值为一个本地路径或者 url 字符串')
      process.exit(0)
      return
    }

    const isLocalPath = preset.startsWith('/') || preset.match(/[a-zA-Z]:(\\\\)|(\/\/)/)

    const isRemotePath = preset.startsWith('http://') || preset.startsWith('https://')

    // 如果是一个远程路径，或者不是本地路径，我们从网络中得到
    if (isRemotePath || !isLocalPath) {
      // 如果是 http 路径
      const response = await axios.get(isRemotePath ? preset : `${PRESET_CDN_BASE_URL}/${preset}.js`)

      // 不要把 preset 的名字写死，否则在本函数被连续调用两次时，第二次的 preset 结果是第一次的内容
      // 这是因为两次的绝对路径相同，require 的缓存机制会导致第二次不重新 require
      const targetPath = tempPath || path.resolve(
        this.basePath,
        `${DEFAULT_PRESET_NAME}-${new Date().getTime().toString()}.js`
      )
      await writeFilePromise(targetPath, response.data)
      presetTmp = require(targetPath)

      // 移除临时 preset 文件
      fs.unlinkSync(targetPath)
    } else {
      // require 预设
      presetTmp = require(preset)
    }

    // 如果是一个函数，我们执行之
    if (typeof presetTmp === 'function') {
      const p = await presetTmp()
      this.preset = Object.assign(this.preset, p)
    } else {
      this.preset = Object.assign(this.preset, presetTmp)
    }
  }

  /**
   * preset getter
   *
   * @author yuzhanglong
   * @date 2021-2-24 22:24:13
   */
  public getPreset() {
    return this.preset
  }

  /**
   * 获取所有需要在构建结束之后删除的 plugins
   *
   * @author yuzhanglong
   * @date 2021-2-26 23:45:24
   */
  public getPluginNamesShouldRemove(): string[] {
    if (Array.isArray(this.preset?.plugins)) {
      const data = this.preset?.plugins?.filter(res => res.removeAfterConstruction)
      return data.map(res => res.name)
    }
    return []
  }
}

export default PresetManager
