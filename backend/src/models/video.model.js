import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //* Coludinary Url
      required: true,
    },

    thumbnail: {
      type: String, //* Coludinary Url
      required: true,
    },

    title: {
      type: String,
      required: [true, "video title is required"],
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // TODO:Coludinary will give us
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// we can't give all the video to the user we need to give in form of pagination
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
