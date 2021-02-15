/*
 * File: commitMessage.js
 * Description: 对 git commit 消息做些什么
 * Created: 2021-2-15 16:11:30
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


// 参考 https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
// 读取文件，这个临时文件形如 '.git/COMMIT_EDITS'，保存了本次 commit 的临时信息
import { checkCommitMessage } from '../utils/common'

const commitMessagePath = process.argv[3]
if (!commitMessagePath) {
  throw new Error('请检查是否传入 commit message 路径')
}

// commit lint 验证
checkCommitMessage(commitMessagePath)