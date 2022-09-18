import express from "express";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";
import { search, home } from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").all(protectorMiddleware).get(getJoin).post(postJoin);
globalRouter.route("/login").all(protectorMiddleware).get(getLogin).post(postLogin);
globalRouter.get("/search", search);

export default globalRouter;
