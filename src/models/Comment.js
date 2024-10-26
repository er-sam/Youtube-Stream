import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  like: {
    type: Number,
    default: 0,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
