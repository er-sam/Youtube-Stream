import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import {jwt} from "jsonwebtoken";
import pkg from 'jsonwebtoken';
const {jwt} = pkg;


const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      lowerCase: true,
      trim: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowerCase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return null;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(this.password, password);
};

UserSchema.pre("save", function (next) {
  const idString = this._id.toString().slice(-4);
  if (this.fullName.length > 6) {
    const trimName = this.fullName.slice(0, 6);
    this.userName = trimName + idString;
  }
});

UserSchema.methods.AccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      userName: this.userName,
      avatar: this.avatar,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", UserSchema);
