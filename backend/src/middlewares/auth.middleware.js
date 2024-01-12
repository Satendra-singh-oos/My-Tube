import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const verifyedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const userId = verifyedToken?._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(405, "Invaled Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(500, "Something went wrong during verify of jwt");
  }
});
