import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  allPlaylist: null,
  playlist: [],
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    getAllPlaylistSuccess: (state, action) => {
      state.loading = false;
      state.allPlaylist = [...action.payload];
    },

    getPlaylistSuccess: (state, action) => {
      state.playlist = [...action.payload];
    },
  },
});

export const { getAllPlaylistSuccess, getPlaylistSuccess } =
  playlistSlice.actions;

export default playlistSlice.reducer;
