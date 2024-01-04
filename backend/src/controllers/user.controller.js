import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { userSchema } from "../validations/user.validation.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/*
* post 
* RegisterUser :-1) will get userInfo from body
* 2) validation of the data with the help of zod
* 3) then finding  is user alredy exist
* 4) then upload the image to cloudnairy 
* 5) and save user data to the db
* 6) return the resoponse exculing -password
 
*/

const registerUser = asyncHandler(async (req, res) => {
  try {
    // validating the incoming values
    const validationResult = userSchema.safeParse(req.body);

    const { username, email, fullName, password } = validationResult.data;

    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors;
      const formattedErrors = validationErrors.map((error) => {
        const path = error.path.join(".");
        return `${path}: ${error.message}`;
      });

      throw new ApiError(
        400,
        formattedErrors,
        "Validation failed. Please check the following fields:"
      );
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar must be needed to create your profile");
    }

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export { registerUser };
