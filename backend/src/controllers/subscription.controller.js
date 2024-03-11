import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  /*
  1)will get req.user?._id and channelId from the req.param 
  2)now we will find that bhot should pr presnet in db which means channelId and subscriber(req.user?._id)
  3) if present delete 
  4) else create new and add in db
  5) return the respective response 
  */

  try {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(channelId)) {
      throw new ApiError(404, "No A Valid Channel Id");
    }

    const isChannelSubscribed = await Subscription.findOne({
      $and: [{ channel: channelId }, { subscriber: userId }],
    });

    if (isChannelSubscribed) {
      await Subscription.findByIdAndDelete(isChannelSubscribed?._id);

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { subscribed: false },
            "Unsubscribed The Channel"
          )
        );
    }

    await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscribed: true },
          "Subscribed The Channel Succesfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
      throw new ApiError(404, "Not A Valid Channel Id");
    }

    const subscribers = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
          pipeline: [
            {
              $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribedToSubscriber",
              },
            },

            {
              $addFields: {
                subscribedToSubscriber: {
                  $cond: {
                    if: {
                      $in: [channelId, "$subscribedToSubscriber.subscriber"],
                    },
                    then: true,
                    else: false,
                  },
                },
                subscribersCount: {
                  $size: "$subscribedToSubscriber",
                },
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: "$subscriber",
        },
      },

      {
        $project: {
          subscriber: {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
            subscribersCount: 1,
            subscribedToSubscriber: 1,
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribers,
          "Fetched ALl Subscriber list of the channel"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
      throw new ApiError(404, "Not A Valid Subscribed Id");
    }

    const subscribedChannels = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "subscribedChannel",
        },
      },

      {
        $unwind: {
          path: "$subscribedChannel",
        },
      },
      {
        $project: {
          subscribedChannel: {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribedChannels,
          "Fetch All The Subscrbed Channel Of the user"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
