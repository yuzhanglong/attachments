/*
 * File: types.ts
 * Description: react plugin 类型定义
 * Created: 2021-2-13 23:35:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// inquiry 选项
import { InquiryResult } from '@attachments/serendipity-core/lib/types/common'

export interface ReactPluginInquireResult extends InquiryResult {
  language: 'JavaScript' | 'TypeScript'
}