import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    // in these schema we names user as channel becuse any user have channel and have sub or can sub other channel
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
