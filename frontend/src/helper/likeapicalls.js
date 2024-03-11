import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const toggleVideoLike = async ({ videoId }) => {
  try {
    const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
    return response.data.data.isLiked;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const toggleCommentLike = async ({ commentId }) => {
  try {
    const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
    return response.data.data.isLiked;
  } catch (error) {
    toast.error("Something Went Wrong");

    console.log(error?.response?.data);
  }
};

export const toggleTweetLike = async ({ tweetId }) => {
  try {
    const response = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
    return response.data.data.isLiked;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getLikedVideos = async () => {
  try {
    const response = await axiosInstance.gey("/likes/videos");
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
