// import logger from "../../logs/logger";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloud } from "../utils/uploadFile.js";

const userRegister = asyncHandler(async (req, res) => {
  console.log("object9", req.body);
  console.log(req.files, req.files?.avatar[0]?.path, "ppp");
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return new ApiError(401, "Inavlid Fileds......");
    }
    const avtar = req.files?.avatar[0]?.path;
    let coverImagepath = "";
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImagepath = req.files.coverImage[0].path;
    }
    const pubid = email.split("@")[0] + new Date().getMilliseconds();
    const avtarRes = await uploadFileOnCloud(avtar, pubid);
    const coverRes = await uploadFileOnCloud(coverImagepath);
    const dbres = await new User({
      email,
      fullName,
      password,
      avatar: avtarRes && avtarRes?.url,
      coverImage: coverRes && coverRes.url,
    }).save({ validateBeforeSave: false });
    const data = {
      ...dbres._doc,
    };
    delete data.password;
    res.send(new ApiResponse(201, data, "User Created"));
    return;
  } catch (error) {
    console.log("userRegister", error);
    // logger.error("userRegister:", error);
    throw new ApiError(500, "error : userRegister server error");
  }
});


//--login---
const userLogin = asyncHandler(async (req, res) => {
  console.log("cred",req.body);
  try {
    const { email, userName, password } = req.body;
    if ((!email && !userName) || !password) {
      throw new ApiError(400, "Invalid credentials");
      return
    }
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
  
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    console.log("login",await user.validatePassword(password));
    const validatePassword = user.validatePassword(password)
    if (!validatePassword) {
      res.status(400).send(new ApiResponse(400,null,"Invalid credentials"))
      throw new ApiError(400, "Invalid credentials");
    }
    const token = await user.AccessToken();
    const userinfo = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      watchHistory: user.watchHistory,
      following : user.following
    };
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    res
      .cookie("token", token, options)
      .send(new ApiResponse(200, { userinfo, token }, "Login successfull"));
  } catch (error) {
    throw new ApiError(500,error,"Auth-Error")
  }
});

export { userRegister, userLogin };
