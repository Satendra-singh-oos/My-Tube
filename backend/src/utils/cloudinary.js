import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // our url will be in response.url

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); // remove the file which is localy saved in our server as the uploading of file in cloudnairy is failed
    return null;
  }
};

const deleteFileOnCloudinary = async (cloudinaryUrl, resource_type) => {
  try {
    if (!cloudinaryUrl) {
      return null;
    }

    const public_id = cloudinaryUrl.split("/").pop().split(".")[0];

    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export { uploadOnCloudinary, deleteFileOnCloudinary };
