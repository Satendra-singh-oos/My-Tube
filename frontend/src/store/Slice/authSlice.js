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
      state.action = true;
      state.userData = null;
    },
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
