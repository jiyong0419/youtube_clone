import express from "express";
import { finishGithubLogin, getChangePassword, getEdit, logout, postChangePassword, postEdit, see, startGithubLogin } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit); //  /users/eidt에 post가 요청되면 multer middleware인 avatarUpload가 avatar라는 이름을 가진 input에서 하나의(single) 파일을 받아온다.
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/:id([a-f0-9]{24})", see); // 16진수 24자리를 parameter id로 지정

export default userRouter;
