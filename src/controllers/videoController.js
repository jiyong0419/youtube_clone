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
  res.render("home", { pageTitle: "Home", videos });
};

export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("watch", { pageTitle: `Watching ${video.title}` });
};

export const edit = (req, res) => {
  res.render("edit");
};
export const search = (req, res) => {
  res.send("Search Video");
};
export const upload = (req, res) => {
  res.send("Upload Video");
};
export const deleteVideo = (req, res) => {
  res.send("Delete Video");
};
