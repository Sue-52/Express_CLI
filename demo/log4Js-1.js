// const log4js = require("log4js");

// 2. 定义日志等级
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

let Kinds = ["buiness", "net"];

for (const kind of Kinds) {
  for (let type in LogType) {
    if (LogType.hasOwnProperty(type)) {
      type = LogType[type];
      let key = kind + "_" + type;
      console.log(key);
      //   appenders[key] = appenderFull(`.${kind}/${type}/${type}`);
      //   categories[key] = {
      //     appenders: [key],
      //     level: type === LogType.NONE ? log4js.levels.ALL : type,
      //   };
    }
  }
}
