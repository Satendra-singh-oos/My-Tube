import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  comments: [],
  totalComments: null,
  hasnextPage: false,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    getAllVideoCommentsSucesss: (state, action) => {
      state.loading = false;
      state.comments = [...action.payload.docs];
      state.totalComments = action.payload.totalDocs;
      state.hasnextPage = action.payload.hasnextPage;
    },

    createACommnet: (state, action) => {
      state.comments = state.comments.unshift(action.payload);
      state.totalComments += state.totalComments;
    },

    deleteACommnet: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload.commentId
      );
      state.totalComments -= state.totalComments;
    },
  },
});

export const { getAllVideoCommentsSucesss, createACommnet, deleteACommnet } =
  commentSlice.actions;

export default commentSlice.reducer;
