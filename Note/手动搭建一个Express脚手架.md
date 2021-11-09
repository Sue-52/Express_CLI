# 手动搭建一个Express脚手架

以 koa2 generate 为模板，使用express手动搭建一个脚手架 ，log4js用来生成日志，Swagger 用来生成API可视化的页面，简易的封装了Mysql等功能。

## 项目的初始化

项目的初始化可以让我们清晰的配置和使用 Express 服务

### 第一步 - 初始化

~~~powershell
npm init -y
~~~

### 第二步 - 安装 express 包

~~~powershell
npm install express
~~~

### 第三步 - 使用 express 初步搭建一个服务器

~~~javascript
// 1. 导入 express 包
const express = require("express");

// 2. 生成 express实例
const app = express();
// 端口
const port = 3000;
// 主机
const host = "localhost";

// 3. 监听端口
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
~~~

### 第四步 - package.json 文件的 scripts 配置

~~~json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon app.js", // 自动nodemon启动服务
    "start": "node app.js" // 使用 node 启动服务
  },
~~~

### 第五步 - 终端调试

~~~powershell
npm run dev
~~~

![image-20211105151030419](https://gitee.com/sue201982/mysql/raw/master/img/202111051510453.png)

成功后在搜索引擎中输入：“http://localhost:3000” 即可看到本地的服务。

## 学习 Log4js 日志配置

Log4js 即是日志管理。

### 日志的作用

- 显示程序运行状态，收集运行信息
- 方便定位，排查，解决线上可能出现的问题
- 结合日志分析软件 ( 譬如 ELK ) 等，对日志进行分析，预警.

### 日志等级

![img](https://gitee.com/sue201982/mysql/raw/master/img/202111051601833.png)

上述是日志分级的图示，和具体权重代码（ 同时包含了输出日志的颜色 ）。我们可以看到，只有当日志的级别，大于等于当前设定的级别时日志才会被输出。

### 日志分类

除了日志的分级以外，还需要对日志进行分类（ 此时可以结合上述的日志级别共同使用 ），譬如：

- 访问日志
  - 对于 http 请求，数据库，磁盘 等 io 访问，可以按照成功与否按照 info 和 error 两个等级再进行细分，以便方便排查，解决问题
  - 对 io 操作的耗时进行记录，对于大于 500ms 的请求，可以使用 warn 级别进行细分，以便后续优化，改善用户体验

- 应用日志
  - 对需要特殊标记的数据进行记录（ 加工过后的数据等 ）
  - 对程序运行过程中，可能产生的异常（ 非 io 异常 ），进行记录，追踪处理
  - 记录程序的运行情况，以便分析性能瓶颈，进行优化

**<font size=5>log4js 代码结构 ( category )</font>**

![](https://gitee.com/sue201982/mysql/raw/master/img/202111051604922.png)

- 使用 log4js 时，我们需要传入一个 category 的分类值（若是不传入，会使用默认分类）
- category 分类下，可以包含多个 appender，每一个 appender 可以单独配置
- appender 用于决定如何输出日志，并且输出到哪里。

### Log4js 简单使用

~~~javascript
// 2.1 日志文件配置 - 导入 log4js
const log4js = require("log4js");
// 2.2 调用 getLogger() 函数
const logger = log4js.getLogger();
// 2.3 设置日志等级 -- info
logger.level = "info";
// 2.4 使用相同或更高的等级（>=infp）可以输出日志
logger.info("Info Message");
~~~

可以在终端上看到这条日志信息

![image-20211105160823991](https://gitee.com/sue201982/mysql/raw/master/img/202111051608009.png)

### Log4js 基本配置

~~~javascript
// 2.1 日志文件配置 - 导入 log4js
const log4js = require("log4js");
log4js.configure({
  appenders: {
    out: { type: "console" },
    app: { type: "file", filename: "./logs/application.log" },
  },
  categories: {
    default: { appenders: ["out", "app"], level: "debug" },
  },
});
// 2.2 调用 getLogger() 函数
const logger = log4js.getLogger();
// 2.3 设置日志等级 -- info
logger.level = "info";
// 2.4 使用相同或更高的等级（>=infp）可以输出日志
logger.info("Info Message");
~~~

上述操作中，我们获取到了默认 category 分类 default，其绑定了两个 appenders，out 和 app，out 会把日志结果输出到标准输入输出流 stdout, app 会把日志输出到文件 application.log。

执行结果：同时在文件 ./logs/application.log 和 标准输出流 stdout 中。

单个 appender 可以服务于多个 category

![img](https://gitee.com/sue201982/mysql/raw/master/img/202111051727243.png)

~~~javascript
const log4js = require('log4js');
// 对 category 和 appenders 进行配置
log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        app: {type: 'file', filename: 'app.log'},
        every: {type: 'dateFile', filename: 'every.log'}
    },
    categories: {
        nice: {appenders: ['out', 'app'], level: 'debug'},
        cheese: {appenders: ['out', 'every'], level: 'info'}
    }
});

let logger = log4js.getLogger('cheese');
logger.info('hello world');
~~~

上述代码中：有两个 category cheese 和 nice。其中 out appender 同时被两个 category 所共有。上述例子中，当我们初始化 log4js.getLogger('cheese') 并写入日志时，日志会根据 out 和 every 两个 appender 同时被写入 stdout 标准输入输出流和 every.log 文件中。

总结一下就是 :

- appender 决定了日志将会被以指定的方式，写入到指定的目标（流，文件，网络）中去
- category 可以自由地选择, 组合各个 appenders 来完成我们想要的日志记录功能
- 同时 category 也定义了当前日志分类的等级 level，来最终决定是否要输出该日志
- catrgory 是 appenders 的组合体 ( 对于 log4js 2.0 之后的版本，之前版本有另外的配置方式 )

### appenders 的种类和用途（日志落盘）

![img](https://gitee.com/sue201982/mysql/raw/master/img/202111051731147.png)

#### dataFile 属性

**<font size=6>appenders----dataFile 用法</font>**

日志处理中常用的 `appender` 类型就是 dateFile，它会按照指定时间周期（通常为1天）进行日志的分割和管理。生成诸如 `myLog-YYYY-MM-DD.log` 日志文件（按照天划分）

**<font size=6>类型 dateFile 的 appenders 参数配置</font>**

1. **type**："dateFile" 首先指定 appenders 的类型。
2. **filename**：用于指定日志落盘的文件地址
3. **pattern**：用于指定日志切分的时间间隔
   1. "yyyy-MM"：精确到月
   2. "yyyy-MM-dd"：精确到天
   3. "yyyy-MM-dd-hh":精确到小时
4. **layout**：选择日志输出的格式
5. **encoding**：编码格式，默认为：utf-8
6. **mode**：默认 0644 无需配置
7. **flags**：默认 a，无需配置
8. **alwaysIncludePattern**：当为 True 时，log文件名会包含之前设置的 pattern 信息。
   1. alwaysIncludePattern 为 true 时，日志名例如 : myLog.log-2018-05-22
   2. alwaysIncludePattern 为 false 时，日志名例如 : myLog.log
9. **daysToKeep**：指定日志保留天数（默认为0，始终保留）
10. **keepFileExt**：是否保持日志文件后缀名 ( 默认为 false，使用 pattern 的情况下，保持默认就好 )
    1.  只有在 **alwaysIncludePattern** 为 false 时生效

代码：

~~~javascript
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
~~~

执行上述代码后，log4js 会以天为分割，每天生成一个名字如 myLog.log-2018-05-20 的日志文件。
其中记录的信息由自定义的 pattern 构成

~~~
{"date":"2021-1105T18:19:20.480","level":"INFO","category":"default","host":"DESKTOP-PCI7BHN","pid":"19588","data":'Info Message'}
~~~

**<font size=6>pattern 配置项解析</font>**

1. **%r**：日志输出时间，以 `toLocaleTimeString` 函数格式化
2. **%p**：日志等级
3. **%c**：日志分类
4. **%h**：访问计算机的 hostname
5. **%m**：打印的日志主题内容
6. **%n**：换行标识
7. **%d**：日志输出日期（默认以 IS8601 方式格式化）
   - 可自定义输出类型 `%d{yyyy/MM/dd-hh.mm.ss}` ，输出 `2018/05/22-15.42.18`
8. **%z**：记录进程 pid 号（数据来自 node方法process.pid）
9. **%x{}**：输出自定义 tokens 中的项目
10. **%[想要输出的内容 %]**：用来给扩展起来的内容着色，颜色和日志 level 有关。

代码：

~~~javascript
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
~~~

#### file 属性

**<font size=6>appenders----file 用法和参数配置</font>**

是一种很常用的日志落盘方式。

- **type** : “file” 首先指定 appenders 的类型为 file
- **filename** : 用于指定日志落盘的文件地址 ( ps : “logs/myLog.log” )
- **layout** : 选择日志输出的格式，默认 basic
- **maxLogSize** : 单文件最大限制 ( 单位 : bytes )
- **backups** : 旧日志最大数量
- **encoding** : 编码格式 （默认 “utf-8”）
- **mode** : 默认 0644 无需配置，使用默认即可
- **flags** : 默认 “a”，无需配置，使用默认即可
- **compress** : compress 为 true，记录当天日志时，会对以往的老日志进行压缩操作，压缩文件后缀为 .gz (默认 : false)
- **keepFileExt** : 是否保持日志文件后缀名 ( 默认为 false，使用 - pattern 的情况下，保持默认就好 )

代码使用：

~~~javascript
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
~~~

#### stdout 属性

该方法用于输出日知道标注输入输出流。

~~~javascript
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
~~~

控制台会输出：

![image-20211105201416765](https://gitee.com/sue201982/mysql/raw/master/img/202111052014793.png)

> 在 log4js 2.0 版本以上都为默认 appender，推荐使用 stdout 而不是console 打印控制台日志 appender-console 在大量日志输出时会占用 V8 大量内存，拖慢系统性能，不推荐使用console。

### Layouts 种类与配置

![img](https://gitee.com/sue201982/mysql/raw/master/img/202111052018739.png)

layout 用来解决如何写入日志，即用来定义日志的格式，layouts的种类如下：

- **Basic**：默认 layout，输出：日志记录事件，等级，分类，日志正文
- **colored**：输出内容和Basic 相同，但是会根据日志等级，对日志进行着色。
- **messagePassThrough**：仅输出日志正文
- **Pattern**：与上文相同。

### replaceConsole 应用

可以将nodeJs应用中 console.log 输出到控制台内容，同时也输出到日志文件中，配置如下：

~~~javascript
// 日志文件配置 - 导入 log4js
const log4js = require("log4js");
log4js.configure({
  replaceConsole:true,
  appenders: {
    out: { type: "stdout" },
  },
  categories: { default: { appenders: ["out"], level: "info" } },
});
// 调用 getLogger() 函数
const logger = log4js.getLogger();
// 使用相同或更高的等级（>=info）可以输出日志
logger.info("Info Message");
~~~

上述配置中，replaceConsole 是和 appenders , categories 在同一层级。

## 开始封装 Log4js 到Express中

~~~javascript
/**
 * Author: Sue_52
 * Desc: 封装 log4js 中间件
 * 参考网址：
 * 1. Log4js封装：https://blog.csdn.net/qq_31766907/article/details/93605851?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-1.no_search_link&spm=1001.2101.3001.4242.2
 * 2. hasOwnProperty 属性：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
 * 3. Log4js 基础讲解：http://shenyujie.cc/2018/05/25/log4js-basic/
 */

// 1. 引入 log4js
const log4js = require("log4js");

// 2. 定义日志等级
const LogType = {
  NONE: "none",
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
};

let Kinds = ["Message"];

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
  default: appenderFull("logs/Message/default/default.log"),
};
let categories = {
  default: {
    appenders: ["default"],
    level: log4js.levels.ALL,
  },
};

// 遍历
for (const kind of Kinds) {
  for (let type in LogType) {
    if (LogType.hasOwnProperty(type)) {
      type = LogType[type];
      let key = kind + "_" + type;
      appenders[key] = appenderFull(`logs/${kind}/${type}/${type}.log`);
      categories[key] = {
        appenders: [key],
        level: type === LogType.NONE ? log4js.levels.ALL : type,
      };
    }
  }
}

// 配置
log4js.configure({
  replaceConsole: true,
  appenders: appenders,
  categories: categories,
});

let KindIndex = 0;
/** 添加日志接口，对应的日志类型将指定日志的输出文件
 * 例如：
 * "none"类型的日志，将把日志内容指定输出到'./business/none/none.log'文件，
 * "error" 类型的日志，将把日志内容指定输出到'./business/none/none.log'文件。
 * @param {LogType | String} type -- 日志类型 "none","debug","info","warn","error","fatal"
 *                                   如果该值不为枚举中的值，那么日志的类型默认设置为"none"类型，且将该参数
 *                                   作为日志内容的开头部分。
 * @param {...} arguments -- 日志内容，参数个数不定（一个或者多个，如果不填，那么默认将type作为日志内容参数）
 * @return {undefined}
 */
exports.log = function (type) {
  try {
    if (arguments.length === 0) return;
    let more = "";
    for (let i = 1; i < arguments.length; i++) {
      more += more === "" ? arguments[i] : "  " + arguments[i];
    }
    if (
      typeof type === "string" &&
      arguments.length > 1 &&
      LogType[type.toUpperCase()]
    ) {
      type = type.toLowerCase();
      log4js
        .getLogger(Kinds[KindIndex] + "_" + type)
        [type === LogType.NONE ? LogType.DEBUG : type](more);
    } else {
      more = type + more;
      log4js
        .getLogger(Kinds[KindIndex] + "_" + LogType.NONE)
        [LogType.DEBUG](more);
    }
  } catch (error) {
    console.error(error);
  }
};

function _registerLogFunc(type) {
  return function () {
    if (arguments.length === 0) return;
    let args = [type];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    exports.log.apply(null, args);
  };
}

// -----------------网络通讯日志-------------------

exports.debug = _registerLogFunc(LogType.DEBUG);
exports.info = _registerLogFunc(LogType.INFO);
exports.warn = _registerLogFunc(LogType.WARN);
exports.error = _registerLogFunc(LogType.ERROR);
exports.fatal = _registerLogFunc(LogType.FATAL);
~~~

如何使用：**app.js**

~~~javascript
FLogger.log("show the result in the file");
FLogger.info("show the result in the file");
FLogger.warn("show the result in the file");
FLogger.debug("show the result in the file");
FLogger.error("show the result in the file");
FLogger.fatal("show the result in the file");
~~~

## post 请求配置

~~~powershell
npm install body-parser;
~~~

app.js

~~~javascript
// 引入 bodyparser 包用于配置 post请求
const bodyParser = require("body-parser");

/**
 * 通过 body-parser中间件解析req.body
 * 根据不同的 Content-Type分别有如下两种不同的配置
 * post请求体中的Content—Type为：application/x-www-form-urlencoded，使用配置1
 * post请求体中的Content-Type为：application/json，使用配置2
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
~~~

### 入门基础

POST 请求报文，如下：

~~~txt
POST /test HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: text/plain; charset=utf8
Content-Encoding: gzip

chyingp
~~~

其中需要我们注意的有Content-Type、Content-Encoding以及报文主体：

- `Content-Type`：请求报文主体的类型、编码。常见的类型有`text/plain`、`application/json`、`application/x-www-form-urlencoded`。常见的编码有`utf8`、`gbk`等。
- `Content-Encoding`：声明报文主体的压缩格式，常见的取值有`gzip`、`deflate`、`identity`。
- 报文主体：这里是个普通的文本字符串`chyingp`。

### body-parser 做了什么工作

body-parser 是新鲜要点如下：

1. 处理不同类型的请求体：如 `text`,`json`,`urlencoded` 等，对应的报文主体的格式口不同
2. 处理不同的编码，如：`utf-8`,`gbk`
3. 处理不同的压缩类型：如：`gzip`,`deflare`等
4. 其他边界、异常的处理

[Express 常用中间件 body-parser 实现解析](https://www.cnblogs.com/chyingp/p/nodejs-learning-express-body-parser.html)

## Swagger UI 配置