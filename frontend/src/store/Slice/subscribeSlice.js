import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  subscribed: null,
  channelSubscribers: [],
  mySubscriptions: [],
};

const subscribeSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    toggleSubscriptionSuccess: (state, action) => {
      state.loading = false;
      state.subscribed = action.payload;
    },

    getAllUserChannelSubscribers: (state, action) => {
      state.loading = false;
      state.channelSubscribers = action.payload;
    },

    getAllSubscribedChannelsOfUser: (state, action) => {
      state.mySubscriptions = action.payload;
    },
  },
});

export const {
  getAllSubscribedChannelsOfUser,
  toggleSubscriptionSuccess,
  getAllUserChannelSubscribers,
} = subscribeSlice.actions;

export default subscribeSlice.reducer;
