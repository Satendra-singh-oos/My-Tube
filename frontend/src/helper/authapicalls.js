import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance.js";

export const userSingup = async (data) => {
  const formData = new FormData();
  formData.append("avatar", data.avatar[0]);
  formData.append("coverImage", data.coverImage[0]);
  formData.append("fullName", data.fullName);
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  try {
    const response = await axiosInstance.post("/users/register", formData);
    toast.success("Registerd User Successfully");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const userLogin = async (data) => {
  try {
    const resposne = await axiosInstance.post("/users/login", data);
    return resposne.data.data.user;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const userLogout = async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    toast.success("Succesfully Logout");
    return response.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};
