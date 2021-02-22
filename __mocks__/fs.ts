/*
 * File: fs.ts
 * Description: fsMock
 * Created: 2021-2-21 18:51:52
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { fs } from 'memfs'
import { patchRequire } from 'fs-monkey'

patchRequire(fs)

module.exports = fs