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

export const commitMessage = (commitPath: string):void => {
  checkCommitMessage(commitPath)
}