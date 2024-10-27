import { Comment } from "../models/Comment.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComments = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    const { videoId } = req.params;
    if (!videoId) {
      throw ApiError(400, "please provide video id");
    }
    if (!text) {
      throw ApiError(400, "please provide comments");
    }
    const comments = await new Comment({
      text,
      user: req.user?._id,
      video: videoId,
    }).save();
    return res
      .status(200)
      .send(new ApiResponse(200, comments, "Comments added"));
  } catch (error) {
    return res.status(500).send(new ApiResponse(500, null, error));
  }
});

const allComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      throw ApiError(400, "please provide video id");
    }
    const comment = await Comment.find({ video: videoId }).populate({
      path: "user",
      select: "_id fullName avatar",
    });
    console.log("comm", comment);
    if (!comment) {
      throw new ApiError(400, "no comments found");
    }

    return res
      .status(200)
      .send(new ApiResponse(200, comment, "Comments added"));
  } catch (error) {
    return res.status(500).send(new ApiResponse(500, null, error.message));
  }
});

const deleteComments = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      throw ApiError(400, "please provide comments id");
    }
    const comment = await Comment.findOne({
      _id: commentId,
      user: req.user?._id,
    });

    if (!comment) {
      return res
        .status(404)
        .send(new ApiResponse(404, null, "Comment not found"));
    }
    await Comment.deleteOne({
        _id: commentId,
        user: req.user?._id,
    })
    return res.status(200).send(new ApiResponse(200, null, "comments deleted"));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, null, error.message));
    throw new ApiError(500, error);
  }
});

export { addComments, allComments, deleteComments };
