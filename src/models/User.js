import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import {jwt} from "jsonwebtoken";
import jwt from "jsonwebtoken";


const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      // required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
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
      default : ""
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
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Creater",
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
  console.log("passw::",this.password,password,await bcrypt.compare(password,this.password));
  return await bcrypt.compare(password,this.password);
};

UserSchema.pre("save", async function (next) {
  const idString = this._id.toString().slice(-4);
  if (this.fullName.length > 6) {
    const trimName = this.fullName.slice(0, 6)+idString;
    this.userName = trimName.replace(/\s+/g, "");
  }
  next();
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
