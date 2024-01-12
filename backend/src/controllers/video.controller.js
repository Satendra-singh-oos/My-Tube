import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { videoSchemaValidation } from "../validations/video.validation.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  /*
  Step 1:-Will get the title and description from the body
  Step 2:- Will get the video and thumbnail from the req.files
  Step 3:-  Create A New Object [have video duration and abpout vedio]
  Step 4:- After everything get fine send response
  */
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(404, "User Must Be Loggin To Publish the Vedio");
    }

    const { error, value } = videoSchemaValidation.validate(req.body);

    if (error) {
      throw new ApiError(403, error?.message);
    }
    const { title, description } = value;
    const thumbnailLocalPath =
      req.files?.thumbnail && req.files?.thumbnail[0]?.path;
    const videoLocalPath =
      req.files?.videoFile && req.files?.videoFile[0]?.path;

    if (!thumbnailLocalPath || !videoLocalPath) {
      throw new ApiError(
        400,
        "Thumbnail and video are required to publish a video"
      );
    }

    // upload files on Cloudinary

    const video = await uploadOnCloudinary(videoLocalPath);
    if (video === null) {
      throw new ApiError(404, "Something Went Wrong ON Uplaoding video");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (thumbnail === null) {
      throw new ApiError(404, "Something Went Wrong ON Uplaoding Thumbnail");
    }

    const newVideo = await Video.create({
      videoFile: video.url,
      thumbnail: thumbnail.url,
      title: title,
      description: description,
      duration: video.duration,
      views: 0,
      isPublished: true,
      owner: userId,
    });

    if (!newVideo) {
      throw new ApiError(
        500,
        "Something Went Wrong During The Save And Publish of The Video"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newVideo, "Succesfully Uploaded Video"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  /*
  Step1:- extract video id from params
  Step2:- search the vedio in db 
  Step3:- if present then send repsosne else send error
   */
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(404, "Video id is required");
    }

    const getVideo = await Video.findById(videoId);
    if (!getVideo) {
      throw new ApiError(404, "No Video Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, getVideo, "Video Fetched Succesfully"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  /*
  Step 1:-Extract the videoId
  Step 2:- get userId from req.user
  Step 3:- find the video details with the help of video id 
  Step 4:- if not then throw err*
  Step 5:- else get owner id from the video and then compare with the userId if not then throw error
  Step 6: If a new thumbnail is provided, update the thumbnail url in db and update the cloudnairy after that Delete the old thumbnail file from Cloudinary 
  Step 7:- update other things if need like tilte and description
  Step 8:- save the video details
  Step 9:- return the new response 
  
  */
  try {
    const { videoId } = req.params;
    const userId = req.user?._id;

    const { error, value } = videoSchemaValidation.validate(req.body);

    if (error) {
      throw new ApiError(403, error?.message);
    }
    const { title, description } = value;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Unable to get the video or wrong video id");
    }

    // Comparing the userId with the video Owner id
    if (userId.toString() !== video.owner.toString()) {
      throw new ApiError(
        404,
        "You Are Not Authorized To update the video details"
      );
    }

    const newThumbnailLocalPath = req.file?.path;

    if (newThumbnailLocalPath) {
      const oldThumbnailUrl = video.thumbnail;

      const newThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);

      if (!newThumbnail.url) {
        throw new ApiError(404, "Unable to upload the thumbnail");
      }

      // saving the updated url
      video.thumbnail = newThumbnail.url;

      // delting the old file from the
      await deleteFileOnCloudinary(oldThumbnailUrl);
    }

    video.title = title || video.title;
    video.description = description || description;

    const updatedVideo = await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Succesfully Update the Video"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  /*
    Step 1:-get the vedioId form parmas
    Step 2:- get the userId from req.user
    Step 3:- compare the userId and video owner id
    Step 4:-if not same throw err
    Step 5:- then delete the video url from db and also Delete the video And Thumbnail file from Cloudinary
    Step 6:- return the success response 
  */
  try {
    const { videoId } = req.params;
    const userId = req.user?._id;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Unable to get the video or wrong video id");
    }

    // Comparing the userId with the video Owner id
    if (userId.toString() !== video.owner.toString()) {
      throw new ApiError(404, "You Are Not Authorized To Delte the video ");
    }

    const deletedVideo = await deleteFileOnCloudinary(video.videoFile);

    const deltedThumbnail = await deleteFileOnCloudinary(video.thumbnail);

    if (deletedVideo.result !== "ok" || deltedThumbnail.result !== "ok") {
      throw new ApiError(500, "Failed to delete old file on Cloudinary");
    }

    await Video.findByIdAndDelete(videoId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Succesfully Deleted The Video"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  /*
  Step 1 :- Extract VideoId from the req parmas
  Step 2:- get the userId from req.user
  Step 3:- find the video in db if not present throw err
  Step 4:- compare the video owner  with the userId if not throw error
  Step 5:- if everthing good till now get the published value and set it ! to
  Step 6:- return the response
   */
  try {
    const { videoId } = req.params;

    const userId = req.user?._id;

    const video = await Video.findById(videoId);

    if (!video || userId.toString() !== video.owner.toString()) {
      throw new ApiError(
        404,
        "Video Not Found Or You Are Not Authorized To update the video details"
      );
    }

    video.isPublished = !video.isPublished;

    const updatedVideo = await video.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVideo,
          "Publish status toggled successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
