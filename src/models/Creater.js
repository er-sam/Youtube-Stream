import mongoose from "mongoose";

const createrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true, 
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  avatar: {
    type: String,
    default: "",
  },
  coverImage: {
    type: String,
  },
  totalViews: {
    type: Number,
    default: 0,
  },
});

export const Creater = mongoose.model("Creater", createrSchema);