/*
 * File: presetManager.ts
 * Description: 预设管理类
 * Created: 2021-2-24 22:12:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import * as fs from 'fs'
import { CommonObject } from '@attachments/serendipity-public/bin/types/common'
import { logger, writeFilePromise } from '@attachments/serendipity-public'
import axios from 'axios'
import { SerendipityPreset } from './types/preset'
import { DEFAULT_PRESET_NAME } from './common'

class PresetManager {
  private readonly basePath: string
  private preset: SerendipityPreset

  constructor(basePath?: string) {
    this.basePath = basePath
    this.preset = {}
  }

  /**
   * 直接使用 preset object 来初始化项目 preset
   *
   * @author yuzhanglong
   * @param preset 对象
   * @date 2021-2-24 22:00:04
   */
  public initPresetByObject(preset: CommonObject) {
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
    if (!preset) {
      logger.error('不合法的 preset, preset 的值为一个本地路径或者 url 字符串')
      process.exit(0)
    }
    if (preset.startsWith('http://') || preset.startsWith('https://')) {
      const response = await axios.get(preset)
      const targetPath = tempPath || path.resolve(this.basePath, DEFAULT_PRESET_NAME)
      await writeFilePromise(targetPath, response.data)
      this.preset = require(targetPath)
      // 移除临时 preset 文件
      fs.unlinkSync(targetPath)
    } else {
      this.preset = require(preset)
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