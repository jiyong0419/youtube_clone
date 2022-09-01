"use strict";

import express from "express";

const app = express();

const PORT = 4000;

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middlewares");
};
const protectedMiddleware = (req, res, next) => {
  if (req.url === "/protected") {
    return res.end();
  } else {
    next();
  }
};

app.use(protectedMiddleware);
app.get("/", logger, handleHome);

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListening); // 서버에 포트번호 부여
