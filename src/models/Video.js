import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  videopath :{
    type : String,
    required : true,
    unique : true
  },
  playbackpath:{
    type : String,
    required : true,
    unique : true
  },
  format :{
    type : String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creater",
  },
  thumbnail: {
    type: String,
    default: "",
  },
  views: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  dislike: {
    type: Number,
    default: 0,
  },
});

export const Video = mongoose.model("Video", videoSchema);
