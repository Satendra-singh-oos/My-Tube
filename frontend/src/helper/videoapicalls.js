import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance.js";
import { BASE_URL } from "../../constants.js";

export const getAllVideos = async ({
  page = 1,
  limit = 10,
  query,
  sortBy,
  sortType,
  userId,
}) => {
  try {
    const url = new URL(`${BASE_URL}/videos`);

    if (userId) {
      url.searchParams.set("userId", userId);
    }
    if (query) {
      url.searchParams.set("query", query);
    }
    if (sortBy && sortType) {
      url.searchParams.set("sortBy", sortBy);
      url.searchParams.set("sortType", sortType);
    }
    if (page) {
      url.searchParams.set("page", page);
    }
    if (limit) {
      url.searchParams.set("limit", limit);
    }

    const response = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const getVideoById = async ({ videoId }) => {
  try {
    const resposne = await axiosInstance.get(`/videos/${videoId}`);

    toast.success(resposne?.data?.message);
    return resposne.data.data;
  } catch (error) {
    toast.error("No Video Found By This Id");
    throw error;
  }
};
