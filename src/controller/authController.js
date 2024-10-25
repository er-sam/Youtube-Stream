// import logger from "../../logs/logger";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloud } from "../utils/uploadFile.js";

const userRegister = asyncHandler(async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return new ApiError(401, "Inavlid Fileds......")
    }
    const avtar = req.files?.avatar[0]?.path;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        const coverImage = req.files.coverImage[0].path;
    }
    const avtarRes = uploadFileOnCloud(avtar);
    const coverRes = uploadFileOnCloud(coverImage);

  } catch (error) {
    console.log("userRegister", error);
    // logger.error("userRegister:", error);
    return new ApiError(500, "error : userRegister");
  }
});

export { userRegister };
