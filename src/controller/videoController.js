import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadVideoToCloudinary } from "../utils/uploadFile.js";

const uploadVideo = asyncHandler(async (req, res) => {
  console.log("object9", req.body);
  console.log(req.file, "ppp");
  try {
    const filePath = req.file.path;
    const publicId = `video-${Date.now()}`;
    const result = await uploadVideoToCloudinary(filePath, publicId);
    console.log("object", result);
  } catch (error) {
    throw new ApiError(500, error);
  }
});


export {
    uploadVideo
}
