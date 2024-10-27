import slugify from "slugify";
import { Video } from "../models/Video.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadVideoToCloudinary } from "../utils/uploadFile.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { redisClient } from "../services/redis-Services.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";

//uploading-video
const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, createrId } = req.body;
    if (!title) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "Please provide title"));
    }

    if (!createrId || !mongoose.isValidObjectId(createrId)) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "video server error"));
    }
    const filePath = req.file?.path;
    if (!filePath) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "No video file uploaded"));
    }
    const publicId = `video-${Date.now()}`;
    const result = await uploadVideoToCloudinary(filePath, publicId);

    const video = await new Video({
      title: title,
      uploadedBy: createrId,
      thumbnail: "",
      slug: slugify(title),
      videopath: result?.secure_url,
      playbackpath: result?.playback_url,
      format: result?.format,
    }).save();

    return res.status(200).send(new ApiResponse(200, video, "video uploaded"));
  } catch (error) {
    const errorMessage =
      error?.error?.code === "ENOTFOUND"
        ? "Please check internet connection"
        : "Server Error";
    res.status(500).send(new ApiResponse(500, null, errorMessage));
  }
});

//view-count-inc
const viewsCounter = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    // console.log("video",video,req.params);
    if (!video) {
      return res
        .status(404)
        .send(new ApiResponse(404, null, "Video not found"));
    }
    await redisClient.incr(`video_views:${videoId}`);
    return res.status(200).send(new ApiResponse(200, null, "Viewed"));
  } catch (error) {
    throw new ApiError(500, error);
  }
});

//video-play
const videoPlay = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "please provide videoId"));
    }
    const video = await Video.findById(videoId).populate({
      path: "uploadedBy",
      select: "_id name avatar",
    });
    // console.log("video", video);
    if (!video) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "video not found"));
    }
    await User.findByIdAndUpdate(
      req.user?._id,
      { $addToSet: { watchHistory: videoId } },
      { new: true, runValidators: true }
    )
    return res
      .status(200)
      .send(new ApiResponse(200, {video}, "video streaming data"));
  } catch (error) {
    throw new ApiError(500, error);
  }
});

//like-video
const likeVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .send(new ApiResponse(404, null, "Video not found"));
    }
    await redisClient.incr(`video_like:${videoId}`);
    return res.status(200).send(new ApiResponse(200, null, "Liked"));
  } catch (error) {
    throw new ApiError(500, error);
  }
});

//display-all-video-by-createrId
const allVideosByCreater = asyncHandler(async (req, res) => {
  try {
    const { createrId } = req.params;
    const videos = await Video.find({
      uploadedBy: createrId,
    }).populate({
      path: "uploadedBy",
      select: "_id name avatar",
    });
    if (!videos) {
      return;
    }
    if (!videos) throw new ApiError(404, "video not found");
    return res.status(200).send(new ApiResponse(200, videos, "videos fetched"));
  } catch (error) {
    res.send(500).send(new ApiResponse(500, null, error.message));
    throw new ApiError(500, error);
  }
});

//display-all-video-by-following-creater
const getVideosByFollowing = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("following");
    const followingCreators = user.following.map((creator) => creator._id);

    const videos = await Video.find({
      uploadedBy: { $in: followingCreators },
    }).populate({
      path: "uploadedBy",
      select: "_id name avatar",
    });
    return res
      .status(200)
      .send(new ApiResponse(200, videos, "Videos retrieved successfully"));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, null, error.message));
    throw new ApiError(500, error);
  }
});

export {
  uploadVideo,
  viewsCounter,
  videoPlay,
  likeVideo,
  allVideosByCreater,
  getVideosByFollowing,
};
