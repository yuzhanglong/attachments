/**
 * File: paint.ts
 * Description: 绘制相关类型定义
 * Created: 2021-08-26 22:22:32
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import type { MonitorOptions } from '../types';

export interface PaintReportData {
  // FP
  firstPaint: Record<string, any>
  // FCP
  firstContentfulPaint: Record<string, any>
  // 汇报时间戳
  timeStamp: number
}

export interface LargestContentfulPaint {
  duration: number
  element: Element
  entryType: string
  id: string
  loadTime: number
  name: string
  renderTime: number
  size: number
  startTime: number
  url: string
}

export interface LargestContentfulPaintReportData {
  // LCP
  largestContentfulPaint: LargestContentfulPaint
  // 汇报时间戳
  timeStamp: number
}

export type PaintMonitorOptions = MonitorOptions<PaintReportData | LargestContentfulPaintReportData>;
