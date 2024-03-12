import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  allPlaylist: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    getAllPlaylistSucess: (state, action) => {
      state.loading = false;
      state.allPlaylist = [...action.payload];
    },
  },
});

export const { getAllPlaylistSucess } = playlistSlice.actions;

export default playlistSlice.reducer;
