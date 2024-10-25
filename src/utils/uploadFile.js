import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
// import { logger } from "../../logs/logger";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloud = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File does not exist:", localFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("Images uploaded to Cloudinary...");
    return response;
  } catch (error) {
    // logger.error("Cloudinary upload error:", error);
    console.log("Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};


const deleteFileOncloud= async(avatar)=>{
    try {
        const q = avatar.split("/").pop().split(".")[0];
        return await cloudinary.uploader.destroy(q);
    } catch (error) {
        console.log("avatardel",error);
        // throw new ApiError(500,error.message);
    }
}

export {uploadFileOnCloud,deleteFileOncloud};
