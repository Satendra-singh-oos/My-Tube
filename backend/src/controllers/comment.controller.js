import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { commentSchemaValidation } from "../validations/comment.validation.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const video = await Video.findById(videoId);

  if (!video || video.isPublished === false) {
    throw new ApiError(404, "Video not found or video is private");
  }

  const commentAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },

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
      $unwind: {
        path: "$owner",
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: "$likes",
        },
        isUserLiked: {
          $cond: {
            if: {
              $in: [req.user?._id, "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        createdAt: 1,
        totalLikes: 1,
        isUserLiked: 1,
      },
    },
  ]);

  const comments = await Comment.aggregatePaginate(commentAggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "All Comments fetched Succesfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  /*
  1) Get The Video Id from req.param 
  2) Get the user id who is need the comment from (req.user?._id) 
  3) find  video exist in db and it should be  published:true
  3) create the new comment and save it in db
  4) send repsone
   */

  try {
    const { videoId } = req.params;
    const userId = req.user?._id;
    const { error, value } = commentSchemaValidation.validate(req.body);

    if (error) {
      throw new ApiError(402, error?.message);
    }

    const { content } = value;
    // const { content } = req.body;

    const video = await Video.findById(videoId);

    if (!video || video.isPublished === false) {
      throw new ApiError(
        404,
        "Video Not Found Or Video is private isPublished false"
      );
    }

    const newComment = await Comment.create({
      content: content,
      video: videoId,
      owner: userId,
    });

    if (!newComment) {
      throw new ApiError(
        500,
        "Something went wrong during save or publish of the commnet"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, newComment.content, "Succesfully added comment")
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  /* 
   1)Find  comment on the base of the commentId in params
   2) check video is published or not 
   3) match the comment Owner.ToString() and userId(req.user?._id)
   4) if all things correct take the content and updated it 
   TODO:Can reduce 1 db call 
   */
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    const { error, value } = commentSchemaValidation.validate(req.body);

    if (error) {
      throw new ApiError(402, error?.message);
    }

    const { content } = value;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "No Commnet found");
    }

    const videoId = comment.video.toString();

    const video = await Video.findById(videoId);

    if (!video || video.isPublished == false) {
      throw new ApiError(402, "Video is private and not found");
    }

    if (comment?.owner.toString() !== userId.toString()) {
      throw new ApiError(
        404,
        "You Can't update these comment as you are not the owner of the comment "
      );
    }
    // comment.content = content;

    // const updatedComment = await comment.save();

    const updatedComment = await Comment.findByIdAndUpdate(
      comment?._id || commentId,
      {
        $set: {
          content: content,
        },
      },
      { new: true }
    );

    if (!updateComment) {
      throw new ApiError(500, "Unable to update the comment");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedComment.content,
          "Succesfuly update the comment"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  /**
   1) find the comment on the bases onc comment id from req.params
   2) check comment owner .toString() === req.user?._id
   3) delte it 
   */
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;
    const comment = await Comment.findById(commentId);

    if (comment?.owner.toString() !== userId.toString()) {
      throw new ApiError(
        404,
        "You Can't Delete these comment as you are not the owner of the comment "
      );
    }

    await Comment.findByIdAndDelete(commentId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully Deleted the comment"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
