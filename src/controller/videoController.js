import slugify from "slugify";
import { Video } from "../models/Video.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadVideoToCloudinary } from "../utils/uploadFile.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { redisClient } from "../services/redis-Services.js";

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
    console.log("video", video);
    if (!video) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "video not found"));
    }
    return res.status(200).send(new ApiResponse(200, video, "video streaming data"));
  } catch (error) {
    throw new ApiError(500, error);
  }
});




export { uploadVideo, viewsCounter, videoPlay };
