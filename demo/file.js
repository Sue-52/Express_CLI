// 日志文件配置 - 导入 log4js
const log4js = require("log4js");
log4js.configure({
  appenders: {
    cheese: {
      type: "file",
      filename: "./logs/fileLog.log",
      layout: {
        type: "pattern",
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      encoding: "utf-8",
      backups: 5,
      compress: false,
      keepFileExt: true,
    },
  },
  categories: { default: { appenders: ["cheese"], level: "info" } },
});
// 调用 getLogger() 函数
const logger = log4js.getLogger();
// 使用相同或更高的等级（>=info）可以输出日志
logger.info("Info Message");
