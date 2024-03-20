import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { tweetSchemaValidation } from "../validations/tweet.validation.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  /*
   1) get the userId from req.user?._id
   2) get the content from the body
   3) create it 
   4) send the response 
  */

  try {
    const userId = req.user?._id;
    const { error, value } = tweetSchemaValidation.validate(req.body);
    if (error) {
      throw new ApiError(403, error?.message);
    }
    const { content } = value;

    const newTweet = await Tweet.create({
      content,
      owner: userId,
    });

    if (!newTweet) {
      throw new ApiError(500, "Soemthing went wront while creating the tweet");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newTweet, "Tweet Created Succesfuuly"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  try {
    /*
    1) get the userId from the req.params
    2) if then create aggreagation from user to tweet
    3) get the data from aggreageation and send response
    */

    // const userId = req.user?._id;
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      throw new ApiError(405, "Not A Valid UserId ");
    }

    // const getTweets = await User.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(userId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "tweets",
    //       localField: "_id",
    //       foreignField: "owner",
    //       as: "tweets",
    //       pipeline: [
    //         {
    //           $lookup: {
    //             from: "likes",
    //             localField: "_id",
    //             foreignField: "tweet",
    //             as: "likes",
    //           },
    //         },
    //         {
    //           $addFields: {
    //             totalLikes: {
    //               $size: "$likes",
    //             },
    //           },
    //         },
    //         {
    //           $project: {
    //             content: 1,
    //             createdAt: 1,
    //             totalLikes: 1,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       username: 1,
    //       avatar: 1,
    //       tweets: 1,
    //       totalLikes: 1,
    //     },
    //   },
    // ]);

    const getTweets = await Tweet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
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
          foreignField: "tweet",
          as: "likeDetails",
          pipeline: [
            {
              $project: {
                likedBy: 1,
              },
            },
          ],
        },
      },

      {
        $addFields: {
          likesCount: {
            $size: "$likeDetails",
          },
          ownerDetails: {
            $first: "$ownerDetails",
          },
          isLiked: {
            $cond: {
              if: { $in: [req.user?._id, "$likeDetails.likedBy"] },
              then: true,
              else: false,
            },
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          content: 1,
          ownerDetails: 1,
          likesCount: 1,
          createdAt: 1,
          isLiked: 1,
        },
      },
    ]);

    if (!getTweets) {
      throw new ApiError(404, "Non Tweets Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, getTweets, "Succesfult fetched the tweets"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  /*
   1) get the tweetId from req.parmas and content from the body
   2) check if the tweet is present in the Db is not throw error
   3) if present check the tweet owner id === req.user._id if not throw error
   4) if all good till now update the content and send response

  */
  try {
    const { tweetId } = req.params;
    const userId = req.user?._id;
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(404, "Not Valid Tweet Id");
    }

    const { error, value } = tweetSchemaValidation.validate(req.body);
    if (error) {
      throw new ApiError(400, error?.message);
    }

    const { content } = value;

    const isTweetPresent = await Tweet.findById(tweetId);

    if (!isTweetPresent) {
      throw new ApiError(404, "Tweet Not Found");
    }

    if (isTweetPresent?.owner.toString() !== userId.toString()) {
      throw (
        ("404", "Oopss!! you are not the owner of tweet you can't edit it ")
      );
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    if (!updatedTweet) {
      throw new ApiError(
        500,
        "Something went wrong during the updation of tweet"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Succesfully Update the tweet"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  /*
  1) get tweet id from params
  2) check is tweet present and also the owner of tweet is === req.user?._id.toString()
  3) if all go delete it
  */

  try {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(403, "Not A Valid Tweet id");
    }

    const isTweetPresent = await Tweet.findById(tweetId);

    if (!isTweetPresent) {
      throw new ApiError(404, "No tweet Found By these id");
    }

    if (isTweetPresent.owner?.toString() !== userId.toString()) {
      throw new ApiError(
        404,
        "Oops you can't delete this tweet as you are not the owner"
      );
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          tweetId,
        },
        "Succesfuly Delted the tweet"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
