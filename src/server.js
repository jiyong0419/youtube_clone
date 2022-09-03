"use strict";

import express from "express";
import morgan from "morgan";

const app = express();

const PORT = 4000;

const logger = morgan("dev");
const protectedMiddleware = (req, res, next) => {
  if (req.url === "/protected") {
    return res.end();
  } else {
    next();
  }
};
const handleHome = (req, res) => {
  return res.send("I love middlewares");
};

app.use(logger);
app.use(protectedMiddleware);
app.get("/", handleHome);

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListening); // 서버에 포트번호 부여
