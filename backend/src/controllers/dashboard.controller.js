import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  /*
   1) get the userId from = req.user?._id 
   2) now using mongose aggregation
   fetching folowwing data
   -username
   -avatar,
   -fullname, 
   -email,
   -totalLikes in all video
   -totalVideos uploaded in channel published and notPublished
   -totalViews in all video
   -totalSubscribers
   -totalChannelSubscribedTo(user subscribed to other channel)
   
  
  */

  try {
    const userId = req.user?._id;

    const channelStats = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscriptions",
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "videos",
          pipeline: [
            {
              $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
              },
            },
            {
              $addFields: {
                totalLikes: {
                  $size: "$likes",
                },
              },
            },
          ],
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
          totalSubscribers: {
            $size: "$subscriptions",
          },
          totalVideos: {
            $size: "$videos",
          },
          totalViews: {
            $sum: "$videos.views",
          },
          totalLikes: {
            $sum: "$videos.totalLikes",
          },
          totalChannelSubscribedTo: {
            $size: "$subscribedTo",
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          totalLikes: 1,
          totalVideos: 1,
          totalViews: 1,
          totalSubscribers: 1,
          totalChannelSubscribedTo: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelStats,
          "Succesfully Fetched The Channel Stats"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  /*
   1) get the userId from = req.user?._id 
   2) now using mongose aggregation which will aplly on video and do match on owner:req.user?._id
   fetching folowwing data
   -videoFile
   -thumbnail,
   -title, 
   -duration,
   -isPublished  video
   -totalLikes on the video
   -created At(Uploaded at)
  */
  try {
    const userId = req.user?._id;

    const allVideo = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "totalLikes",
        },
      },
      {
        $addFields: {
          totalLikes: { $size: "$totalLikes" },
          createdAt: {
            $dateToParts: { date: "$createdAt" },
          },
        },
      },

      {
        $project: {
          _id: 1,
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          duration: 1,
          isPublished: 1,
          createdAt: {
            year: 1,
            month: 1,
            day: 1,
          },
          totalLikes: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, allVideo, "Succesfully Fetched the user all video")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { getChannelStats, getChannelVideos };
