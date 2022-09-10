"use strict";

import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

const logger = morgan("dev");
const protectedMiddleware = (req, res, next) => {
  if (req.url === "/protected") {
    return res.end();
  } else {
    next();
  }
};
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(protectedMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
