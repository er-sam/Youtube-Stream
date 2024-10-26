import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
import fs from "fs";
import path from "path";

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloud = async (localFilePath,public_id) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File does not exist:", localFilePath);
      return null;
    }
    //uploading-file
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto",
      public_id
    });
    console.log("Images uploaded to Cloudinary...");
    //delete-locally-after-uploaded
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // logger.error("Cloudinary upload error:", error);
    console.log("Cloudinary-error:", error);
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

const uploadVideoToCloudinary = async (filePath, publicId) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      public_id: publicId, 
      folder: "videos",
    });
    console.log("Video uploaded successfully:", response);
    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath);
    console.error("Cloudinary video upload error:", error);
    throw error;
  }
};





export {uploadFileOnCloud,deleteFileOncloud,uploadVideoToCloudinary};
