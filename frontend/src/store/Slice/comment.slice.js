import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  comments: [],
  totalComments: null,
  hasNextPage: false,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    getAllVideoCommentsSucesss: (state, action) => {
      state.comments = [...action.payload.docs];
      state.totalComments = action.payload.totalDocs;
      state.hasNextPage = action.payload.hasNextPage;
    },

    createACommnetSuccess: (state, action) => {
      state.comments = state.comments.unshift(action.payload);
      state.totalComments += state.totalComments;
    },

    deleteACommnetSuccess: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload.commentId
      );
      state.totalComments -= state.totalComments;
    },
  },
});

export const {
  getAllVideoCommentsSucesss,
  createACommnetSuccess,
  deleteACommnetSuccess,
} = commentSlice.actions;

export default commentSlice.reducer;
