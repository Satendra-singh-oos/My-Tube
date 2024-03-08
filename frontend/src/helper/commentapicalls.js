import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";
import { BASE_URL } from "../../constants";

export const getVideoComments = async ({ videoId, page, limit }) => {
  const url = new URL(`${BASE_URL}/comment/${videoId}`);
  if (page) {
    url.searchParams.set("page", page);
  }
  if (limit) {
    url.searchParams.set("limit", limit);
  }

  try {
    const resposne = await axiosInstance.get(url);
    return resposne.data.data;
  } catch (error) {
    toast("No Comments Found For The Video");
    throw error;
  }
};
