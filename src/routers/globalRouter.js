import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => {
  res.send("HOME");
};

globalRouter.get("/", handleHome);

export default globalRouter;
