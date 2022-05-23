import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const likeReducer = createReducer(initialState, {
  likeRequest: (state) => {
    state.loading = true;
  },
  likeSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  likeFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },

  addCommentRequest: (state) => {
    state.loading = true;
  },
  addCommentSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  addCommentFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },
  deleteCommentRequest: (state) => {
    state.loading = true;
  },
  deleteCommentSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  deleteCommentFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
   
  },

  createPostRequest: (state) => {
    state.loading = true;
  },
  createPostSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  createPostFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },


  updateCaptionRequest: (state) => {
    state.loading = true;
  },
  updateCaptionSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  updateCaptionFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },


  deletePostRequest: (state) => {
    state.loading = true;
  },
  deletePostSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  deletePostFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },

  UpdateProfileRequest: (state) => {
    state.loading = true;
  },
  UpdateProfileSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  UpdateProfileFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },

  UpdatePasswordRequest: (state) => {
    state.loading = true;
  },
  UpdatePasswordSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  UpdatePasswordFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },
  
  deleteProfileRequest: (state) => {
    state.loading = true;
  },
  deleteProfileSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  deleteProfileFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },
  forgotPasswordRequest: (state) => {
    state.loading = true;
  },
  forgotPasswordSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  forgotPasswordFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },
  followUserRequest: (state) => {
    state.loading = true;
  },
  followUserSuccess: (state, action) => {
    state.loading = false;
    state.message = action.payload;
  
  },
  followUserFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },


  clearErrors: (state, action) => {
    state.error =null;
  },
  clearMessage: (state, action) => {
    state.message = null;
  },
});

export const myPostsReducer = createReducer(initialState,{
  myPostsRequest: (state) => {
    state.loading = true;
  },
  myPostsSuccess: (state, action) => {
    state.loading = false;
    state.posts = action.payload;
  
  },
  myPostsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },
  clearErrors: (state, action) => {
    state.error =null;
  },
})
export const userPostsReducer = createReducer(initialState,{
  userPostsRequest: (state) => {
    state.loading = true;
  },
  userPostsSuccess: (state, action) => {
    state.loading = false;
    state.posts = action.payload;
  
  },
  userPostsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  
  },
  clearErrors: (state, action) => {
    state.error =null;
  },
})