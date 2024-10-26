import { Creater } from "../models/Creater";
import { ApiError } from "../utils/apierrorhandle";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFileOnCloud } from "../utils/uploadFile";

const addCreater = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send(new ApiError(401, "Please provide a name"));
    }

    const avatarPath = req.files?.["creater-avatar"]?.[0]?.path;
    let coverImagePath = req.files?.["creater-coverImage"]?.[0]?.path || "";

    const pubId = `${name}-creater-${new Date().getMilliseconds()}`;
    const avatarRes = avatarPath ? await uploadFileOnCloud(avatarPath, pubId) : null;
    const coverRes = coverImagePath ? await uploadFileOnCloud(coverImagePath,pubId) : null;

    const newCreater = new Creater({
      name,
      user: req.user?._id,
      avatar: avatarRes?.url || "",
      coverImage: coverRes?.url || "",
    });
    
    const dbres = await newCreater.save({ validateBeforeSave: false });
    res.status(201).send(new ApiResponse(201, dbres, "Welcome Creator"));
  } catch (error) {
    res.status(500).send(new ApiError(500, error.message || "Server error"));
  }
});

export { addCreater };




























// import { Creater } from "../models/Creater";

// const addCreater = asyncHandler(async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) {
//       return new ApiError(401, "please provide name");
//     }
//     const avtar = req.files?.avatar[0]?.path;
//     let coverImagepath = "";
//     if (
//       req.files &&
//       Array.isArray(req.files.coverImage) &&
//       req.files.coverImage.length > 0
//     ) {
//       coverImagepath = req.files.coverImage[0].path;
//     }
//     const pubid = name + "-creater" + new Date().getMilliseconds();
//     const avtarRes = await uploadFileOnCloud(avtar, pubid);
//     const coverRes = await uploadFileOnCloud(coverImagepath);
//     const dbres = await new Creater({
//       name,
//       user : req.user?._id,
//       avatar: avtarRes && avtarRes?.url,
//       coverImage: coverRes && coverRes.url,
//     }).save({ validateBeforeSave: false });

//     res.send(new ApiResponse(201, dbres, "Welcome Creater"));
//     return;
//   } catch (error) {
//     res.status(500).send(new ApiError(500, error))
//     throw new ApiError(500, "error :"+error);
//   }
// });


// export {
//     addCreater
// }