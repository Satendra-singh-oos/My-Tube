import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slice/authSlice";
import videoSlice from "./Slice/video.slice";
import commentSlice from "./Slice/comment.slice";
import subscribeSlice from "./Slice/subscribeSlice";
import likeSlice from "./Slice/likeSlice";
import playlistSlice from "./Slice/playlistSlice";
import userSlice from "./Slice/userSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    video: videoSlice,
    comment: commentSlice,
    subscribe: subscribeSlice,
    like: likeSlice,
    playlist: playlistSlice,
    user: userSlice,
  },
});

export default store;
