import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slice/authSlice";
import videoSlice from "./Slice/video.slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    video: videoSlice,
  },
});

export default store;
