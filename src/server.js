"use strict";

import express from "express";

const app = express();

const PORT = 4000;

const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to: ${req.url}`);
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middlewares");
};

app.get("/", gossipMiddleware, handleHome);

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListening); // 서버에 포트번호 부여
