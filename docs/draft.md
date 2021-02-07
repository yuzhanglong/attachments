# Service -- cli 服务层

简述：

Service 是脚手架的服务层 它负责处理项目的启动、开发、部署 类似于我们熟知的 react-scripts

在用户执行 create <project-name> 之后，我们会初始化一个 serviceManager 类，在这之后：

- 在用户执行命令的目录下，一个 package.json 将被创建，这个文件只被创建一次，在开发中用户直接面向的也是这个文件。
- 在 node-modules 下，有一个 serendipity-service-react 包，它是 service 的核心，封装了启动、开发、部署等操作
- 这个包用户无需修改，由脚手架的开发者维护，通过终端命令 serendipity-service xxx 暴露给用户
- service 还可以通过配置文件的形式，向用户暴露自定义 webpack 配置接口



# Plugin -- cli 插件层

