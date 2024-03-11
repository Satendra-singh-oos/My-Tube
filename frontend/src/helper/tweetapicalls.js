import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const createTweet = async ({ content }) => {
  try {
    const response = await axiosInstance.post(`/tweets`, { content });
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const updateTweet = async ({ tweetId, content }) => {
  try {
    const response = await axiosInstance.patch(`/tweets/${tweetId}`, {
      content,
    });
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const deleteTweet = async ({ tweetId }) => {
  try {
    const response = await axiosInstance.delete(`tweets/${tweetId}`);
    // success message will be there show the message in toast
    return response.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getUserTweets = async ({ userId }) => {
  try {
    const response = await axiosInstance.get(`tweets/user/${userId}`);
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
