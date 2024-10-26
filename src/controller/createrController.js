import { Creater } from "../models/Creater.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloud } from "../utils/uploadFile.js";

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



const follow = asyncHandler(async(req,res)=>{
    try {
        console.log("object",req.body);
        const { createrId } = req.body;
        const creater = await Creater.findByIdAndUpdate(
            createrId,
            { $addToSet: { followers: req.user?._id } },
            { new: true, runValidators: true }
        );

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {$addToSet:{following:createrId}},
            {new:true,runValidator : true}
        ).select('-password');
        const data={
            creater,
            user
        }
        if (!creater) {
            return res.status(404).send(new ApiResponse(404,null,"creater not found"))
        }

        res.status(200).send(new ApiResponse(200,data,"Follower added successfully"))
    } catch (error) {
        res.status(500).send(new ApiResponse(500,null,"Server error"));
        throw new ApiError(500,error);
    }
})

const Unfollow = asyncHandler(async(req,res)=>{
    try {
        console.log("object",req.body);
        const { createrId } = req.body;
        const creater = await Creater.findByIdAndUpdate(
            createrId,
            { $pull: { followers: req.user?._id } },
            { new: true, runValidators: true }
        );

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {$pull:{following:createrId}},
            {new:true,runValidator : true}
        ).select('-password');
        const data={
            creater,
            user
        }
        if (!creater) {
            return res.status(404).send(new ApiResponse(404,null,"creater not found"))
        }

        res.status(200).send(new ApiResponse(200,data,"Follower removed successfully"))
    } catch (error) {
        res.status(500).send(new ApiResponse(500,null,"Server error"));
        throw new ApiError(500,error);
    }
})

const allFollowedCreater=asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user?._id).populate('following');

        if(!user){
            throw new ApiError(404,"user not found");
        }
        const data ={
            _id : user._id,
            name :user.fullName,
            avatar : user.avatar,
            following : user.following
        }
        res.status(200).send(new ApiResponse(200,data,"All following data"));
    } catch(error) {
        res.status(500).send(new ApiResponse(500,null,"Server error"));
        throw new ApiError(500,error);
    }
})



const createrAlldata=asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        const creater = await Creater.findById(id)            .populate({
            path: 'followers user',
            select: '_id fullName avatar'
        });
        if(!creater){
            throw new ApiError(404,"user not found");
        }
        res.status(200).send(new ApiResponse(200,creater,"creater data"));
    } catch(error) {
        res.status(500).send(new ApiResponse(500,null,"Server error"));
        throw new ApiError(500,error);
    }
})

export { addCreater,follow,Unfollow,allFollowedCreater,createrAlldata};




























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