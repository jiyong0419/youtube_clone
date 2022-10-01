"use strict";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch"; // node-fetch패키지는 Node.js에게 fetch 함수를 이해시킨다

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  // 비밀번호 일치확인
  if (password !== password2) {
    return res.status(400).render("join", { pageTitle: "Join", errorMessage: "Password confirmation does not match." });
  }
  // username,email 중복확인
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", { pageTitle: "Join", errorMessage: "This username/email is already taken." });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", { pageTitle: "Join", errorMessage: "An error has occurred" });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // username 체크
  const exists = await User.exists({ username });
  if (!exists) {
    return res.status(400).render("login", { pageTitle: "Login", errorMessage: "An account with this username deos not exists." });
  }
  // password체크
  const user = await User.findOne({ username, socialLogin: false });
  const ok = await bcrypt.compare(password, user.password); // password를 해싱했을때 user.password가 나오는가 true / false
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit User" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, email: sessionEmail, username: sessionUsername, avatarUrl },
    },
    body: { name, username, email, location },
    file,
  } = req;
  //수정이 됬다면 중복확인
  const changeEmail = sessionEmail !== email;
  const changeUsername = sessionUsername !== username;
  if (changeEmail) {
    const existsEmail = await User.exists({ email });
    if (existsEmail) {
      return res.status(400).render("edit-profile", { pageTitle: "Edit Profile", errorMessage: "Email already exists" });
    }
  }
  if (changeUsername) {
    const existsUsername = await User.exists({ username });
    if (existsUsername) {
      return res.status(400).render("edit-profile", { pageTitle: "Edit Profile", errorMessage: "Username already exists" });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      username,
      email,
      location,
    },
    { new: true } // findByIdAndUpdate는 변경전 Data를 반환하지만, new:ture를 해주면 변경후 Data를 반환해줌
  );
  req.session.user = updatedUser;
  return res.redirect("/");
};
export const logout = (req, res) => {
  req.session.destroy();
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  // user.videos = ObjectId[16진수 24자리]
  // populate를 사용하면 user.videos = [{video객체},{video객체}....]
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("profile", { pageTitle: user.name, user });
};
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  console.log(tokenRequest);
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(emailData);
    const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //create an account
      user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
        socialLogin: true,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialLogin) {
    req.flash("error", "Can't change password");
    return res.redirect("/");
  }
  return res.status(400).render("change-password", { pageTitle: "Chage Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { nowPassword, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(nowPassword, user.password);
  if (!ok) {
    return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "Now Password is wrong" });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "New Password and New Password Confirm do not match" });
  }
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password updated");
  return res.redirect("/users/logout");
};
