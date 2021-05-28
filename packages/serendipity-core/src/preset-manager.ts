/*
 * File: presetManager.ts
 * Description: 预设管理类
 * Created: 2021-2-24 22:12:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import axios from 'axios'
import {
  logger, writeFilePromise,
  DEFAULT_PRESET_NAME,
  BaseObject, PRESET_CDN_BASE_URL
} from '@attachments/serendipity-public'
import { SerendipityPreset } from './types/preset'
import { DEFAULT_PRESET } from './common'

export class PresetManager {
  private readonly preset: SerendipityPreset

  constructor(preset?: SerendipityPreset) {
    this.preset = preset || DEFAULT_PRESET
  }

  /**
   * 直接使用 preset object 来初始化项目 preset
   *
   * @author yuzhanglong
   * @param preset 对象
   * @date 2021-5-28 21:45:15
   */
  public static async createPresetManagerByObject(preset: BaseObject) {
    const p = await PresetManager.initPresetObject(preset)
    return new PresetManager(p)
  }

  /**
   * 根据远程路径获取 presetManager
   *
   * @author yuzhanglong
   * @date 2021-5-28 21:27:01
   * @param basePath preset 保存的临时目录
   * @param url preset 远程路径
   */
  public static async createPresetManagerByRemotePath(basePath: string, url: string) {
    // 判断是否为远程路径
    const isRemotePath = url.startsWith('http://') || url.startsWith('https://')
    if (!isRemotePath) {
      throw new Error('不合法的 preset 路径!')
    }

    logger.info(`⚙ 从 ${url} 获取 preset 中...`)

    // 远程获取 preset 内容
    const response = await axios.get(url)
    const targetPath = path.resolve(
      basePath,
      `${DEFAULT_PRESET_NAME}-${new Date().getTime().toString()}.js`
    )
    await writeFilePromise(targetPath, response.data)
    const presetTmp = require(targetPath)
    const finalPreset = await PresetManager.initPresetObject(presetTmp) as SerendipityPreset
    return new PresetManager(finalPreset)
  }

  /**
   * 根据本地路径获取 presetManager
   *
   * @author yuzhanglong
   * @date 2021-5-28 21:41:14
   * @param localPath preset 本地路径
   */
  public static async createPresetManagerByLocalPath(localPath: string) {
    const isLocalPath = localPath.startsWith('/') || (localPath.match(/[a-zA-Z]:(\\\\)|(\/\/)|(\\)/) !== null)
    if (!isLocalPath) {
      throw new Error('不合法的本地 preset 路径！')
    }
    const res = require(localPath)
    const finalPreset = await PresetManager.initPresetObject(res)
    return new PresetManager(finalPreset as SerendipityPreset)
  }

  /**
   * 根据 preset 名称获取 presetManager，我们会从 GitHub 仓库的默认 preset 目录下获取
   *
   * @author yuzhanglong
   * @date 2021-5-28 22:43:58
   * @param basePath 基本路径
   * @param name preset 名称
   */
  public static async createPresetByName(basePath: string, name: string) {
    const remotePath = `${PRESET_CDN_BASE_URL}/${name}.js`
    return PresetManager.createPresetManagerByRemotePath(basePath, remotePath)
  }

  /**
   * 处理 preset，由于 preset 可能是个函数，如果是的话，我们需要执行值以获取最终 preset
   *
   * @author yuzhanglong
   * @date 2021-5-28 21:29:17
   * @param presetTmp 未处理过的 preset
   */
  public static async initPresetObject(presetTmp: BaseObject): Promise<SerendipityPreset> {
    if (typeof presetTmp === 'function') {
      const p = await (presetTmp as any)()
      return {
        ...DEFAULT_PRESET,
        ...p as BaseObject
      }
    }

    return {
      ...DEFAULT_PRESET,
      ...presetTmp as BaseObject
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
    const data = this.preset?.plugins?.filter(res => res.removeAfterConstruction)
    return data.map(res => res.name)
  }
}
