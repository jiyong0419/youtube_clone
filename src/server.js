"use strict";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import flash from "express-flash";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";

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
// post된 form으로 부터 정보를 읽어들일 준비를 한다. (req.body)
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET, // 우리 서버가 제공한 세션이라는 싸인
    resave: false, // 기존 세션에 수정사항이 없으면 저장하지 않음
    saveUninitialized: false, // 신규 세션이 수정사항이 없으면 저장하지 않음
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), // 세션 데이터를 Mongo Store에 저장함 (기본값은 서버의 Memory Store)
    cookie: { maxAge: 3600000 }, // 세션의 만료기한 (1000 = 1s)
  })
);
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
}); // ffmpeg6

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); // upload 요청이 들어오면 upload폴더에 접근시켜줌
app.use("/assets", express.static("assets")); // assets 요청이 들어오면 assets폴더에 접근시켜줌
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
