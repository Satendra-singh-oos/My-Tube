import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  //   loading: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    currentUser: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    updatedAvatar: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },

    updatedCoverImage: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },

    updatedUserDetails: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
