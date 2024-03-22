import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  deleteFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import {
  loginValidation,
  updateUserDetailsValidation,
  userSchemaValidation,
} from "../validations/user.validation.js";
import mongoose from "mongoose";

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.genrateAccessToken();
    const refreshToken = await user.genrateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong during the genration of the access and refresh token"
    );
  }
};

/**
 * Register a new user.
 *
 * POST /api/v1/users/register
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
    const coverImageLocalPath =
      req.files?.avatar && req.files?.coverImage[0]?.path;

    if (!avatarLocalPath || !coverImageLocalPath) {
      throw new ApiError(
        400,
        "Avatar & coverImage must be needed to create your profile"
      );
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(
        401,
        "UserName Or Email Allredy exist in db try to login"
      );
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

/**
 * Log in a user.
 *
 * POST /api/users/login
 */

const loginUser = asyncHandler(async (req, res) => {
  /* 
    Step 1: Get username or email and password from the frontend and validate
    Step 2: Verify username or email and password from the database
    Step 3: If verified, generate the refresh and access tokens
    Step 4: Save the refresh token in the database
    Step 5: Send the response and set refresh and access tokens in cookies
  */

  try {
    const { error, value } = await loginValidation.validate(req.body);

    if (error) {
      throw new ApiError(403, error.message);
    }

    const { username, email, password } = value;

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(400, "User Doesnot exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new ApiError(404, "Check Your Password is Incorrect");
    }

    const { refreshToken, accessToken } = await genrateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "play-my-tube-frontend.vercel.app",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("random", "rendom hai vaii", options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged In Succesfully"
        )
      );
  } catch (error) {
    throw new ApiError(404, error?.message);
  }
});

/**
 * Logout a user.
 *
 * POST /api/users/logout
 */

const logoutUser = asyncHandler(async (req, res) => {
  /*
    Step 1: Get the userId from the authenticated user in the request
    Step 2: Find the user and remove the refreshToken from the database
    Step 3: Remove both the accessToken and refreshToken cookies from the client
  */
  try {
    const userId = req.user?._id;

    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1, // this will remove the field from document [was geting undefine in refreshToken Db]
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "play-my-tube-frontend.vercel.app",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logout"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

/**
 * Refresh access token using a valid refresh token.
 *
 * POST /api/users/refresh-token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  /*
    Step 1: Get the refresh token from the cookie, request body, or headers
    Step 2: Verify the incoming refresh token against the secret
    Step 3: Get the userId from the verified refresh token
    Step 4: Find the user in the database using the userId
    Step 5: Ensure the incoming refresh token matches the stored refresh token
    Step 6: Generate new access and refresh tokens
    Step 7: Set the new tokens in cookies and send the response
  */

  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.headers?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(404, "No refresh token found");
  }

  const verifyiedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFERESH_TOKEN_SECRET
  );

  if (!verifyiedRefreshToken) {
    throw new ApiError(404, "Your Refresh token is wrongs");
  }

  const userId = verifyiedRefreshToken?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "No user found or Invalid REfresh Token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
      404,
      "Refersh Token dosen't match might be expierd or used , Try Login Again"
    );
  }

  const { refreshToken, accessToken } =
    await genrateAccessAndRefreshToken(userId);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    domain: "play-my-tube-frontend.vercel.app",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, newRefreshToken: refreshToken },
        "Acces Token Refreshed Succesfully"
      )
    );
});

/**
 * Change the current user's password.
 *
 * POST /api/users/change-password
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    // Step 1: Get user id from the request as the user is authenticated
    // Step 2: Find user from the database using the user id
    // Step 3: Compare oldPassword with the user's current password in the database
    // Step 4: If the user is not found, throw a 404 error
    // Step 5: If the old password is incorrect, throw a 400 error
    // Step 6: Set the new password for the user
    // Step 7: Save the user with the new password (validateBeforeSave set to false to bypass validation)
    // Step 8: Respond with a success message and the new password

    const userId = req.user?._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "No user Found");
    }

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isOldPasswordCorrect) {
      throw new ApiError(400, "Old Password is wrong");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, newPassword, "Password Updated Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Some thing went wrong during change current password"
    );
  }
});

/**
 * get the current user .
 *
 * POST /api/users/getCurrentUser
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    // Step 1: Get user from the request as the user is authenticated
    const user = req.user;

    if (!user) {
      throw new ApiError(400, "No UserId Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Details fetched Succesfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong to get the current user"
    );
  }
});

/**
 * Update user account details.
 *
 * POST /api/users/update-account
 */
const updateUserAccountDetails = asyncHandler(async (req, res) => {
  try {
    /* 
      Step 1: Get data from req.body and validate
      Step 2: Use updateUserDetailsValidation to validate the request body.
      Step 3: If validation fails, throw a 400 error with the validation message.
    */
    const { error, value } = await updateUserDetailsValidation.validate(
      req.body
    );

    if (error) {
      throw new ApiError(400, error?.message);
    }

    const { fullName, email } = value;

    const userId = req.user?._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          email,
        },
      },
      { new: true }
    ).select("-password  -refreshToken");

    if (!user) {
      throw new ApiError(404, "No User Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated succesfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something wen wrong during update User Account Details"
    );
  }
});

/**
 * Update user avatar.
 *
 * PATCH /api/users/update-avatar
 */
const updateUserAvatar = asyncHandler(async (req, res) => {
  /*
    Step 1: Get userId from the authenticated user in the request
    Step 2: Get avatarLocalPath from req.file, which is provided by multer middleware
    Step 3: Find user by userId
    Step 4: Get the oldAvatarUrl from the user in the database
    Step 5: Delete the old avatar file from Cloudinary
    Step 6: Upload the new avatar to Cloudinary
    Step 7: Update the user's avatar URL in the database
    Step 8: Send the response with the updated user details

   */
  try {
    const userId = req.user?._id;
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new ApiError(404, "No Avatar Uploaded || Avatar file missing");
    }

    const oldUser = await User.findById(userId);

    if (!oldUser) {
      throw new ApiError(400, "No user found by these Id");
    }

    // go the oldAvatarUrl
    const oldAvatarCloudinaryUrl = oldUser.avatar;

    // uploading on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
      throw new ApiError(400, "Error while uploading the avatart try again");
    }

    // saving the updated url
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    const response = await deleteFileOnCloudinary(
      oldAvatarCloudinaryUrl,
      "image"
    );

    if (response.result !== "ok") {
      throw new ApiError(500, "Failed to delete old file on Cloudinary");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "updated user avatar succesfully"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

/**
 * Update user avatar.
 *
 * PATCH /api/users/update-coverImage
 */
const updateUserCoverImage = asyncHandler(async (req, res) => {
  /*
    Step 1: Get userId from the authenticated user in the request
    Step 2: Get coverImageLocalPath from req.file, which is provided by multer middleware
    Step 3: Find user by userId
    Step 4: Get the oldCoverImageUrl from the user in the database
    Step 5: Delete the old avatar file from Cloudinary
    Step 6: Upload the new avatar to Cloudinary
    Step 7: Update the user's avatar URL in the database
    Step 8: Send the response with the updated user details

   */

  try {
    const coverImageLocalPath = req.file?.path;
    const userId = req.user?._id;

    if (!coverImageLocalPath) {
      throw new ApiError(404, "No Avatar Uploaded || Avatar file missing");
    }

    const oldUser = await User.findById(userId);

    if (!oldUser) {
      throw new ApiError(400, "No user found by these Id");
    }

    // go the oldCoverImageUrl
    const oldCoverImageCloudinaryUrl = oldUser.coverImage;

    // uploading on cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
      throw new ApiError(400, "Error while uploading the coverImage try again");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          coverImage: coverImage.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    const response = await deleteFileOnCloudinary(
      oldCoverImageCloudinaryUrl,
      "image"
    );

    if (response.result !== "ok") {
      throw new ApiError(500, "Failed to delete file on Cloudinary");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "updated user Cover Image succesfully"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  try {
    /*
      Step 1: Get the username from the request parameters
      Step 2: Validate if the username is provided
      Step 3: Aggregate query to fetch user channel profile
      Step 4: Lookup subscribers and subscribedTo information using the 'subscription' collection
      Step 5: Add additional fields like subscriberCount, channelSubscribedToCount, and isSubscribed
      Step 6: Project only the necessary fields
      Step 7: Validate if the channel exists
     Step 8: Send the response with the fetched user channel data
    */
    const { username } = req.params;

    if (!username.trim()) {
      throw new ApiError(400, "username is missing");
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError(404, "channel does not exists");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
      );
  } catch (error) {
    throw new ApiError(400, error?.message);
  }
});

const getWatchHistory = asyncHandler(async (req, res) => {
  /*
  Step 1: Get user ID from the authenticated user in the request
  Step 2: Check if the user ID is available
  Step 3: Use MongoDB aggregation to fetch user and their watch history
  Step 4: Match user based on user ID
  Step 5: Match user based on user ID
  Step 6: Sub-pipeline for additional lookup operations on the "video" collection
  Step 7: Lookup owner details from the "user" collection
  Step 8: Project specific fields from the "user" collection
  Step 9: Add a field "owner" containing the first result from the owner lookup
  Step 10: Check if a user with watch history is found
  Step 11: Send the response with the watch history
  
  */
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(402, "No user id found");
    }

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    if (!user?.length) {
      throw new ApiError("400", "No User Found ");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user[0].watchHistory,
          "Watch history fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

/**
 * Add video to user history.
 *
 * PATCH /api/users/update-coverImage
 */

const addVideoToUserWatchHistory = asyncHandler(async (req, res) => {
  /*
   Step 1: Extract videoId and userId from request parameters and user object 
   Step 2: Validate videoId and userId
   Step 3: Find user by userId
   Step 4: Check if user exists
   Step 5: Check if video is already in watch history
   Step 6: If video is already in watch history, throw an error
   Step 7: Add video to watch history
   Step 8: Save changes to user
   Step 9: Respond with updated watch history
   */
  try {
    const { videoId } = req.parmas?.videoId;
    const userId = req.user?._id;

    if (!videoId) {
      throw new ApiError(403, "No video Id");
    }
    if (!userId) {
      throw new ApiError(403, "No user Id");
    }
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(403, "No User Found");
    }

    const isVideoInWatchHistory = await user.watchHistory.some((video) =>
      video.equals(videoId)
    );

    if (!isVideoInWatchHistory) {
      throw new ApiError(403, "Video allready in watch history");
    }

    await user.watchHistory.push(new mongoose.Types.ObjectId(videoId));

    await user.save({ validateBeforeSave: true });

    return res
      .status(200)
      .json(
        new ApiResponse(200, user.watchHistory, "Video added to watch history.")
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  addVideoToUserWatchHistory,
};
