import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addVideoToUserWatchHistory,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/refresh-Token").post(refreshAccessToken);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-Password").post(verifyJWT, changeCurrentPassword);

router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateUserAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watch-history").get(verifyJWT, getWatchHistory);

router
  .route("/watch-history/:videoId")
  .post(verifyJWT, addVideoToUserWatchHistory);

export default router;
