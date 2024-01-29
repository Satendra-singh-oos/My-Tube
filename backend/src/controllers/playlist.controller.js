import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { playlistSchemaValidation } from "../validations/playlist.validation.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  /*
  1) get the data  from req.body which is name,description 
  2) then create the playlist
  */
  try {
    const userId = req.user?._id;
    const { error, value } = playlistSchemaValidation.validate(req.body);

    if (error) {
      throw new ApiError(401, error.message);
    }
    const { name, description } = value;

    const playlist = await Playlist.create({
      name,
      description,
      owner: userId,
    });

    if (!playlist) {
      throw new ApiError(404, "Something went wrong during playlist creation");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist Created Succesfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  /*
  1) get the userId from the params
  2) compare the userId with the owner in the playlist
  3) send repsonse accordingly
   */
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const playlist = await Playlist.findOne({ owner: userId });

    if (!playlist) {
      throw new ApiError(405, "No Playlist found for these user id ");
    }

    const allPlaylist = await Playlist.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
        },
      },

      {
        $addFields: {
          totalVideos: { $size: "$videos" },
          totalViews: { $sum: "$videos.views" },
          latestVideo: { $arrayElemAt: ["$videos", -1] },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          totalVideos: 1,
          totalViews: 1,
          updatedAt: 1,
          latestVideo: {
            thumbnail: 1,
          },
        },
      },
    ]);

    if (!allPlaylist) {
      throw new ApiError(404, "Not Abel to fetch the playlist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, allPlaylist, "Succesfuly fetched the playlist")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
  try {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(404, "Not A Valid Playlist Id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "No Playlist found for these id ");
    }

    const playlistDetails = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
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
      {
        $addFields: {
          totalVideos: {
            $size: "$videos",
          },
          totalViews: {
            $sum: "$videos.views",
          },
        },
      },

      {
        $project: {
          name: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          totalVideos: 1,
          totalViews: 1,
          videos: {
            _id: 1,
            videoFile: 1,
            thumbnail: 1,
            title: 1,
            description: 1,
            owner: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
            duration: 1,
            createdAt: 1,
            views: 1,
          },
        },
      },
    ]);

    if (!playlistDetails) {
      throw new ApiError(
        500,
        "Something went wrong during the fetching of the playlist data"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlistDetails,
          "Succesfully fetched the data of playlist"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  /*
  1)get playlistId and videId from  the req.params
  2)find is playlist exist in db if no handle it 
  3) then check is videoId which is for a video is exist in db or not 
  4) then check the owner of playlist must be same as the user which is req.user?._id
  4) if all condition fulllfiled add  video in the array
  */
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(404, "Playlist Id or Video Id is not valid");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "No Playlist found ");
    }

    const video = await Video.findById(videoId);

    if (!video || !video.isPublished) {
      throw new ApiError(404, "No Video Found or video is private");
    }

    if (playlist?.owner.toString() !== userId.toString()) {
      throw new ApiError(
        409,
        "You can add video in playlist as you are not the owner of playlist "
      );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: {
          videos: videoId,
        },
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new ApiError(
        400,
        "Something went wrong during the addeding of video in the playlist"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Video Succesfuly added to playlist"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  /*
  1) get the video and playlist id from the params
  2) check for the playlist Id and  then check is videoId which is for a video is exist in db or not 
  4) then check the owner of playlist  must be same as the user which is req.user?._id
  4) if all condition fulllfiled remove the video form the array 
    */

  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(402, "Playlist Id or Video Id is not valid");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "No Playlist found ");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "No Video Found");
    }

    if (playlist?.owner.toString() !== userId.toString()) {
      throw new ApiError(
        409,
        "You can delet the video from playlist as you are not the owner"
      );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          videos: videoId,
        },
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new ApiError(
        400,
        "Something went wrong during the removing of video in the playlist"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Video Succesfuly Removed from the Playlist"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  /*
  1) get the playlistId from the params
  2) now check the playlist owner must be qual to the user which is req.user?._id
  3) then delete
  
  */
  try {
    const { playlistId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(402, "Not A Valid Playlist Id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "No Playlist Found");
    }

    if (playlist?.owner.toString() !== userId.toString()) {
      throw new ApiError(404, "Only Owner Cna delete this playlist");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Succesfully deleted the playlist"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  /*
  1)get playlistId  from  the req.params
  2)get name ,description from the req.body
  2)find is playlist exist in db if no handle it 
  3) then check is playlist owner must be equal to the user which is req.user?._id 
  4) if all well update it 

  */

  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userId = req.user?._id;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(402, "Not A valid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist Not Found");
    }

    if (playlist?.owner.toString() !== userId.toString()) {
      throw new ApiError(
        400,
        "Only Owner is allowed to edit the playlist details"
      );
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          name,
          description,
        },
      },
      { new: true }
    );

    if (!updatePlaylist) {
      throw new ApiError(500, "Unable to update the playlist details");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatePlaylist,
          "Succesfuly updated the playlist details"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
