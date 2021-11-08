// 1. 引入 log4js
const log4js = require("log4js");
const LogType = {
  NONE: "none",
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
};
const LogTypeOrder = {
  NONE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
};

// 封装 appenders
/**
 *
 * @param {String} filename 传入文件夹地址
 * @returns {
 * "data":"2021-11-05T21:21:21.290",
 * level":"INFO",
 * category":"default",
 * host":"DESKTOP-PCI7BHN",
 * pid":"20368",
 * data":'Info Message'
 * } 输出格式为这个：
 */
function appenderFull(filename) {
  return {
    type: "dateFile", // 类型
    filename: filename, // 存放路径
    encoding: "utf-8", // 存储编码
    layout: {
      // 自定义log输出内容
      type: "pattern",
      pattern:
        '{%n "data":"%d", %n "level":"%p", %n "category":"%c", %n "host":"%h", %n "pid":"%z", %n "data":\'%m\' %n}',
    },
    pattern: "-yyyy-MM-dd", //日志文件按日期分割
    keepFileExt: true, // 回滚旧的日志文件时，保证以 .log结尾
    alwaysIncludePattern: true, // 输出的日志文件名是是中包含 pattern 日期结尾
    maxLogSize: "100M", // 文件最大存储空间
  };
}

// 创建 appenders 、 categories
let appenders = {
  default: appenderFull("./default/default.log"),
};
let categories = {
  defualt: {
    appenders: ["default"],
    level: log4js.levels.ALL,
  },
};

// 遍历
for (let type in LogType) {
  if (LogType.hasOwnProperty(type)) {
    type = LogType[type];
    let key = "buiness" + "_" + type;
    appenders[key] = appenderFull(`.buiness/${type}/${type}.log`);
    categories[key] = {
      appenders: [key],
      level: type === LogType.NONE ? log4js.levels.ALL : type,
    };
  }
}

const obj = {
  appenders: appenders,
  categories: categories,
};
// console.log(obj);
// console.log(log4js.levels.ALL);
