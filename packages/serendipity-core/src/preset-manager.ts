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
  BaseObject, isRemotePath, isLocalPath
} from '@attachments/serendipity-public'
import { DEFAULT_PRESET } from './common'
import { SerendipityPreset } from './types'

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
    if (!isRemotePath(url)) {
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
    if (!isLocalPath(localPath)) {
      throw new Error('不合法的本地 preset 路径！')
    }
    const res = require(localPath)
    const finalPreset = await PresetManager.initPresetObject(res)
    return new PresetManager(finalPreset as SerendipityPreset)
  }

  /**
   * 路径获取 presetManager
   * - 当目的路径为远程路径（http protocol） 或者本地路径（file protocol）时，分别调用相应工厂函数
   * - 如果目的路径不是上面两种情况，我们要求用户传入一个回调函数来处理！
   *
   * @author yuzhanglong
   * @date 2021-6-3 00:32:34
   * @param target 目标 url
   * @param tmpPath preset 临时保存路径
   * @param callback 回调函数，见上面的描述
   */
  public static async createPresetManager(target: string, tmpPath?: string, callback?: (path: string) => any) {
    if (!isRemotePath(target) && !isLocalPath(target)) {
      if (!callback) {
        throw new Error('you should pass callback for not-remote-path and not-local-path preset!')
      }
      return await callback(target)
    }

    if (isRemotePath(target)) {
      return await PresetManager.createPresetManagerByRemotePath(tmpPath, target)
    }

    return await PresetManager.createPresetManagerByLocalPath(target)
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
