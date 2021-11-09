const express = require("express");
const router = express.Router();

router.use(function tiemLog(req, res, next) {
  console.log("Time:", Date.now());
  next();
});

router.get("/index", (req, res) => {
  res.send("首页");
});

module.exports = router;
