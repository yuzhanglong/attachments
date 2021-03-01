import { Construction, Inquiry, Runtime, Script } from '@attachments/serendipity-scripts'

class MyPlugin {
  @Construction()
  myConstruction() {
    // 在构建模式下做些什么
  }

  @Runtime()
  myRuntime() {
    // 在 runtime 模式下做些什么
  }

  @Inquiry()
  myInquiry() {
    // 发起质询
    return []
  }

  @Script('hello-world')
  myScript() {
    // 在用户执行 serendipity-scripts hello-world 之后 做些什么
  }
}

export default MyPlugin
