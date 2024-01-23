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
  /*
   
   step1 :- we will get the info form the query 
   step2- we have mongooseAggregatePagination plugin 
  */
  try {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    /*
     Throw these api you will get all the video with the query(search by titile ),sortBy,SortType and userId(by these query you can get all video by the following user with perticular userId)
    */

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const pipeline = [];

    // first will match those video which isPublished true
    pipeline.push({
      $match: {
        isPublished: true,
      },
    });

    // will match the title
    if (query) {
      pipeline.push({
        $match: {
          title: {
            $regex: query,
            $options: "i",
          },
        },
      });
    }

    if (userId) {
      pipeline.push({
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      });
    }

    //sortBy can be views, createdAt, duration
    //sortType can be ascending(-1) or descending(1)

    if (sortBy && sortType) {
      pipeline.push({
        $sort: {
          [sortBy]: sortType === "asc" ? 1 : -1,
        },
      });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "channelInfo",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$channelInfo",
      }
    );

    const videosAggregate = Video.aggregate(pipeline);

    const vidos = await Video.aggregatePaginate(videosAggregate, options);

    return res
      .status(200)
      .json(new ApiResponse(200, vidos, "Videos fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
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
    if (!video.url) {
      throw new ApiError(404, "Something Went Wrong ON Uplaoding video");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail.url) {
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
   Step 3:- if present create a mongodb aggregation pipline case we want to send the
    is videoAlreadyLiked ,
    totalSubscriberof channel, isUserSubscribed to the channel , 
    channel info like(channel name , channel avatar , channelTotalSubs),
    total View and also increse the video view count,
    push the id in userWatchHistory
    also increse the view count
    Step4:-Adde video to user history 

    TODO:Check THis pipeline after the createion of other controller i guess it is wrong
    TODO: 2 Video Db Call make it 1 

  */
  try {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId) {
      throw new ApiError(404, "Video id is required");
    }

    // increse view count
    const video = await Video.findByIdAndUpdate(videoId, {
      $inc: {
        views: 1,
      },
    });

    if (!video) {
      throw new ApiError(404, "No Video Found");
    }

    const getVideo = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
          isPublished: true,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "owner",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "channelInfo",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "videoLikes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "video",
          as: "videoComments",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          isUserSubscribed: {
            $cond: {
              if: { $in: [userId, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
          totalLikes: {
            $size: "$videoLikes",
          },
          isUserLiked: {
            $cond: {
              if: { $in: [userId, "$videoLikes.likedBy"] },
              then: true,
              else: false,
            },
          },
          totalComments: {
            $size: "$videoComments",
          },
          channelInfo: {
            $first: "$channelInfo",
          },
        },
      },

      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          subscribersCount: 1,
          isUserSubscribed: 1,
          totalLikes: 1,
          isUserLiked: 1,
          totalComments: 1,
          channelInfo: 1,
        },
      },
    ]);

    if (!getVideo) {
      throw new ApiError(404, "No Video Found");
    }

    if (getVideo.length == 0) {
      throw new ApiError(401, "Video is Private || Empty Video");
    }

    // increse view  (fronten will show +1 from there side )
    // cause if someone clicked and  his internet got off it will increse the iew count in db which is not good i guees ?
    //   await Video.findByIdAndUpdate(videoId, {
    //   $inc: {
    //     views: 1,
    //   },
    // });

    // pushing video in user watch history
    // $addToSet The operator adds a value to an array unless the value is already present

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        watchHistory: videoId,
      },
    });

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
    if (userId.toString() !== video?.owner.toString()) {
      throw new ApiError(
        404,
        "You Are Not Authorized To update the video details"
      );
    }

    const newThumbnailLocalPath = req.file?.path;
    const oldThumbnailUrl = video.thumbnail;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title: title || video.title,
          description: description || video.description,
          thumbnail: newThumbnailLocalPath
            ? (await uploadOnCloudinary(newThumbnailLocalPath)).url
            : video.thumbnail,
        },
      },
      { new: true }
    );

    if (!updatedVideo) {
      throw new ApiError(404, "Unable to update the video or wrong video id");
    }

    // delting the old file from the Cloudinary
    if (newThumbnailLocalPath) {
      await deleteFileOnCloudinary(oldThumbnailUrl, "image");
    }
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

    const deletedVideo = await deleteFileOnCloudinary(video.videoFile, "video");

    if (deletedVideo.result !== "ok") {
      throw new ApiError(500, "Failed to delete Video file on Cloudinary");
    }
    const deletedThumbnail = await deleteFileOnCloudinary(
      video.thumbnail,
      "image"
    );

    if (deletedThumbnail.result !== "ok") {
      throw new ApiError(500, "Failed to delete Thumbanialfile on Cloudinary");
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
