// 1.1 导入 express 包
const express = require("express");
// 引入封装的Log4js
const FLogger = require("./logs/config");
// 导入 nodeJs 的 path 模块
const path = require("path");
// 引入 bodyparser 包用于配置 post请求
const bodyParser = require("body-parser");
// 跨域请求
const cors = require("cors");

// 1.2 生成 express实例
const app = express();
// 端口
const port = 3000;
// 主机
const host = "localhost";

// 引入路由
const index = require("./routes");

// 允许跨域
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

// 配置静态目录
app.use("/static", express.static(path.join(__dirname, "public")));

/**
 * 通过 body-parser中间件解析req.body
 * 根据不同的 Content-Type分别有如下两种不同的配置
 * post请求体中的Content—Type为：application/x-www-form-urlencoded，使用配置1
 * post请求体中的Content-Type为：application/json，使用配置2
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// post 请求测试
// app.post("/post", (req, res) => {
//   const result = req.body;
//   console.log(result);
//   res.end(result.username);
// });
// 路由挂载
app.use(index);

// 日治文件配置
FLogger.log("show the result in the file");
// FLogger.info("show the result in the file");
// FLogger.warn("show the result in the file");
// FLogger.debug("show the result in the file");
// FLogger.error("show the result in the file");
// FLogger.fatal("show the result in the file");

// 1.2 监听端口
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
