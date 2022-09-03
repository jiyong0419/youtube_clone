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
  res.send("HOME");
};
const handleEditUser = (req, res) => {
  res.send("Edit User");
};
const handleWatchVideo = (req, res) => {
  res.send("Watch Video");
};

const globalRouter = express.Router();
const userRouter = express.Router();
const videoRouter = express.Router();

app.use(logger);
app.use(protectedMiddleware);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.get("/", handleHome);

globalRouter.get("/", handleHome);
userRouter.get("/edit", handleEditUser);
videoRouter.get("/watch", handleWatchVideo);

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListening); // 서버에 포트번호 부여
