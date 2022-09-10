"use strict";
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, uppercase: true, trim: true, minLength: 1 },
  description: { type: String, required: true, maxLength: 140 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
