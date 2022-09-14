"use strict";

import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
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

app.use(
  session({
    secret: "Hello!",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/youtube_clone" }),
  })
);

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
