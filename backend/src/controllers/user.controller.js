import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { userSchemaValidation } from "../validations/user.validation.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Register a new user.
 *
 * POST /api/v1/users/register
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response containing the registered user data (excluding password).
 *
 * @throws {ApiError} - Throws an ApiError with status code and message in case of validation or registration failure.
 */

const registerUser = asyncHandler(async (req, res) => {
  try {
    // validating the incoming values
    const { error, value } = userSchemaValidation.validate(req.body);

    if (error) {
      // Joi validation failed
      throw new ApiError(400, error.message);
    }
    const { fullName, username, email, password } = value;
    const avatarLocalPath = req.files?.avatar && req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar must be needed to create your profile");
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(401, "User Allredy exist try to login");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const newUser = await User.create({
      username,
      email,
      fullName,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const newUserId = newUser._id;

    const createdUser = await User.findById(newUserId).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registring the user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User Created Succesfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message,
      "SomeThing Wen Wrong During RegisterUser"
    );
  }
});

// const loginUser = asyncHandler(async (req,res)=>{})

export { registerUser };
