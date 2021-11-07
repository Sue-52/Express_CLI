// 1.1 导入 express 包
const express = require("express");

// 1.2 生成 express实例
const app = express();
// 端口
const port = 3000;
// 主机
const host = "localhost";

// 日志文件配置 - 导入 log4js
const log4js = require("log4js");
log4js.configure({
  appenders: {
    out: { type: "stdout" },
  },
  categories: { default: { appenders: ["out"], level: "info" } },
});
// 调用 getLogger() 函数
const logger = log4js.getLogger();
// 使用相同或更高的等级（>=info）可以输出日志
logger.info("Info Message");

// 1.2 监听端口
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
