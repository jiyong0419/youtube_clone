"use strict";
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, uppercase: true, trim: true, minLength: 1 },
  videoUrl: { type: String, required: true },
  description: { type: String, required: true, maxLength: 140 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "USER" },
});
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0].split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
