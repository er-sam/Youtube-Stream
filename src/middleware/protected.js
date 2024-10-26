import { User } from "../models/User.js";
import { ApiError } from "../utils/apierrorhandle.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Retrieve token from cookies or authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Please provide a token");

    // Verify token and decode user info
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ApiError(401, "Invalid token");

    // Attach user to request object for downstream middleware
    req.user = user;
    next();
  } catch (error) {
    // Send response and forward error
    res.status(401).send(new ApiResponse(401, null, "Unauthorized action"));
    next(new ApiError(500, error.message || "Server Error"));
  }
});
