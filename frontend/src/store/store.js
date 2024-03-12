import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slice/authSlice";
import videoSlice from "./Slice/video.slice";
import commentSlice from "./Slice/comment.slice";
import subscribeSlice from "./Slice/subscribeSlice";
import likeSlice from "./Slice/likeSlice";
import playlistSlice from "./Slice/playlistSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    video: videoSlice,
    commnet: commentSlice,
    subscribe: subscribeSlice,
    like: likeSlice,
    playlist: playlistSlice,
  },
});

export default store;
