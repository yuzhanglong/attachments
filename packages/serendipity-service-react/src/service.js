#!/usr/bin/env node

/*
 * File: service.js
 * Description: 针对某个框架的 service 服务
 * Created: 2021-1-23 16:35:05
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


const program = require('commander');
const ReactService = require("../src/core/ReactService");

const reactService = new ReactService();


program
  .command("start")
  .description("执行开发 server")
  .action((name, opt) => {
    console.log("dev server 被执行了~");
    // 这个任务的执行环境为 cli-react-service

    // step 1 -- 配置合并与注入
    // 在这里，我们要执行配置的合并 这些配置来自于
    // 用户在该包外面的配置
    // 自身的配置

    // step 2 -- 执行 devServer 做了 webpack 的配置，但未来会考虑别的打包框架
  });


program
  .command("build")
  .description("打包您的项目")
  .action(() => {
    console.log("build 被执行了~");
  })