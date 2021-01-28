/*
 * File: ReactService.js
 * Description: React Service 业务类
 * Created: 2021-1-23 19:48:58
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const serve = require("./serve");

class ReactService {
  constructor() {
    this.collectConfig();
  }

  // TODO: 配置收集，这包括用户的配置和默认配置
  collectConfig() {

  }

  runDevServer(options) {
    serve(options);
  }

}


module.exports = ReactService;