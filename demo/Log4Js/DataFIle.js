// 2.1 日志文件配置 - 导入 log4js
const log4js = require("log4js");
log4js.configure({
  replaceConsole: true,
  appenders: {
    cheese: {
      // 设置类型
      type: "dateFile",
      // 配置生成文件
      filename: "./logs/myLog.log",
      // 编码格式配置
      encoding: "utf-8",
      // 配置 layout，此处使用自定义模式 pattern
      layout: {
        type: "pattern",
        // 配置模式
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期分割
      pattern: "-yyyy-MM-dd",
      // 回滚旧的日志文件时，保证以 .log结尾
      keepFileExt: true,
      // 输出的日志文件名是是中包含 pattern 日期结尾
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ["cheese"], level: "debug" },
  },
});
// 2.2 调用 getLogger() 函数
const logger = log4js.getLogger();
// 2.3 使用相同或更高的等级（>=infp）可以输出日志
logger.info("Info Message");

// ----------------pattern--------------------
// 日志文件配置 - 导入 log4js
const log4js = require("log4js");
//配置pattern
log4js.configure({
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: "pattern",
        pattern: "%d %p %c %x{user} %m%n",
        tokens: {
          user: function () {
            return "Sue_52";
          },
        },
      },
    },
  },
  categories: { default: { appenders: ["out"], level: "info" } },
});
// 调用 getLogger() 函数
const logger = log4js.getLogger();
// 使用相同或更高的等级（>=infp）可以输出日志
logger.info("Info Message");
