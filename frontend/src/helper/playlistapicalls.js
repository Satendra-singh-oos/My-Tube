import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const createPlaylist = async ({ name, description }) => {
  try {
    const response = await axiosInstance.post("/playlist", {
      name,
      description,
    });

    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const addVideoToPlaylist = async ({ playlistId, videoId }) => {
  try {
    const response = await axiosInstance.patch(
      `/playlist/add/${videoId}/${playlistId}`
    );
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const removeVideoFromPlaylist = async ({ videoId, playlistId }) => {
  try {
    const response = await axiosInstance.patch(
      `/playlist/remove/${videoId}/${playlistId}`
    );
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const updatedPlaylist = async ({ playlistId, description, name }) => {
  try {
    const response = await axiosInstance.patch(`/playlist/${playlistId}`, {
      name,
      description,
    });
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getPlaylistById = async ({ playlistId }) => {
  try {
    const response = await axiosInstance.get(`/playlist/${playlistId}`);
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
