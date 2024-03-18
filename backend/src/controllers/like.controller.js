import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  /*
   1) get the videoID from req.parms
   2) now find dose user Already liked the video make that video uniliked hence Delete the Object
   4) if not found create a new object with videoId and onwer by req.user?._id
   5) send the reponse 
  */
  try {
    //TODO: toggle like on video

    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Not A Valid VideoId");
    }

    const isVideoAlreadyLiked = await Like.findOne({
      $and: [{ video: videoId }, { likedBy: userId }],
    });

    if (isVideoAlreadyLiked) {
      await Like.findByIdAndDelete(isVideoAlreadyLiked?._id);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { isLiked: false },
            "Unliked The Video Successfully"
          )
        );
    }

    await Like.create({
      video: videoId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: true }, "Liked The Video Successfully")
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    //TODO: toggle like on comment

    const { commentId } = req.params;
    const userId = req.user?._id;
    if (!isValidObjectId(commentId)) {
      throw new ApiError(404, "Not A Valid Comment Id");
    }

    const isCommentAlreadyLiked = await Like.findOne({
      $and: [{ comment: commentId }, { likedBy: userId }],
    });

    if (isCommentAlreadyLiked) {
      await Like.findByIdAndDelete(isCommentAlreadyLiked?._id);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { isLiked: false },
            "Unliked The Comment Successfully"
          )
        );
    }

    await Like.create({
      comment: commentId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true },
          "Liked The Comment Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet

  try {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(404, "Not A Valid Tweet Id");
    }

    const isTweetAlreadyLiked = await Like.findOne({
      $and: [{ tweet: tweetId }, { likedBy: userId }],
    });

    if (isTweetAlreadyLiked) {
      await Like.findByIdAndDelete(isTweetAlreadyLiked?._id);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { isLiked: false },
            "Unliked The Tweet Successfully"
          )
        );
    }

    await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: true }, "Liked The Tweet Successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  // challenging aggregation piplene will use*THINK*
  /*
  Best piepline tile now i wrote 
  1) get userId from the req.user?._id
  2) now write aggregation piepline 
 */

  try {
    const userId = req.user?._id;

    const likedVideoAggregate = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $match: {
          video: { $exists: true },
        },
      },

      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "video",
          pipeline: [
            {
              $match: {
                isPublished: true,
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
              },
            },

            {
              $addFields: {
                owner: {
                  username: {
                    $first: "$ownerDetails.username",
                  },
                  avatar: {
                    $first: "$ownerDetails.avatar",
                  },
                  fullName: {
                    $first: "$ownerDetails.fullName",
                  },
                },
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: "$video",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "likedBy",
          foreignField: "_id",
          as: "likedBy",
        },
      },
      {
        $unwind: {
          path: "$likedBy",
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $project: {
          likedBy: {
            username: 1,
            avatar: 1,
          },

          video: {
            videoFile: 1,
            thumbnail: 1,
            description: 1,
            title: 1,
            duration: 1,
            views: 1,
            createdAt: 1,
            owner: 1,
            _id: 1,
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideoAggregate, "Fetched All Liked Video")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
