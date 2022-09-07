"use strict";
let videos = [
  {
    title: "Video1",
    rating: 0.1,
    comments: 1,
    createdAt: "1 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Video2",
    rating: 0.2,
    comments: 1,
    createdAt: "2 minutes ago",
    views: 2,
    id: 2,
  },
  {
    title: "Video3",
    rating: 0.3,
    comments: 1,
    createdAt: "3 minutes ago",
    views: 3,
    id: 3,
  },
];
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  return res.redirect("/");
};
