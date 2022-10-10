"use strict";
import { isGeneratorFunction } from "regenerator-runtime";
import Comment from "../models/Comment";
import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== _id) {
    req.flash("error", "Not authorized"); // flash message를 만들어둔다
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== _id) {
    req.flash("error", "Only this video's owner can edit this video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("info", "The editing is complete.");
  res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    files: { video, thumb },
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      videoUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      description,
      owner: _id,
      hashtags,
      // hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("info", "The uploading is complete.");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "appear error");
    return res.status(400).render("upload", { pageTitle: "Upload Video" });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== _id) {
    req.flash("error", "Only this video's owner can delete this video.");
    return res.status(403).redirect("/");
  }
  console.log(id);
  await Video.findByIdAndDelete(id);
  req.flash("info", "The deleting is complete.");
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
    return res.render("search", { pageTitle: "Search", videos });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200); // status는 상태코드를 바꾸기만하는것 그다음에 redirect나 render가 필요함, sendStatus는 바꾼 상태코드를 보내고 연결을 끊는다
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const loggedInUser = await User.findById(user._id);
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();
  loggedInUser.comments.push(comment._id);
  await loggedInUser.save();
  return res.status(201).json({ newCommentId: comment._id }); // res.json은 json(객체)를 전송해주고 request를 종료한다, res.render를 사용못하는이유는 res.render는 페이지가 아예 rendering되기때문임. 해당 코드같은경우엔 상태코드와 json만 보내면 됨
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.body;
  const comment = await Comment.find(commentId);
  if (!comment) {
    console.log("Good");
    return res.sendStatus(404);
  }
  await Comment.findByIdAndDelete(commentId);
  await comment.save();
  return res.sendStatus(201);
};
