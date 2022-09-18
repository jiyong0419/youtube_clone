import express from "express";
import { finishGithubLogin, getEdit, logout, postEdit, see, startGithubLogin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", see);

export default userRouter;
