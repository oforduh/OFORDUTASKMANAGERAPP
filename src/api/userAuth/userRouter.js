import express from "express";
const router = new express.Router();
import { authenticateUser } from "../../helper/authenticateUser.js";
import { upload, handleErrorMiddleware } from "../../helper/multer.js";

import {
  handleCreateUser,
  updateUserProfile,
  handleGetUsers,
  handleUserLogout,
  handleUserLogin,
  handleLogoutAllTokens,
  handleGetLoggedInUserProfile,
  handleDeleteProfile,
  handleSingleUser,
  handleUserAvatar,
  handleDeleteUserAvatar,
  getAUserAvatar,
} from "./userController.js";

router.post("/user/create", handleCreateUser);
router.get("/users", authenticateUser, handleGetUsers);
router.delete("/users/me", authenticateUser, handleDeleteProfile);
router.get("/users/me", authenticateUser, handleGetLoggedInUserProfile);
router.post("/login", handleUserLogin);
router.patch("/user/me/edit", authenticateUser, updateUserProfile);
router.post("/logout", authenticateUser, handleUserLogout);
router.post("/logoutAll", authenticateUser, handleLogoutAllTokens);
router.get("/user/:id", authenticateUser, handleSingleUser);
router.get("/users/:id/avatar", getAUserAvatar);

router.post(
  "/users/me/avatar",
  authenticateUser,
  upload.single("avatar"),
  handleUserAvatar,
  handleErrorMiddleware
);

router.delete("/users/me/avatar", authenticateUser, handleDeleteUserAvatar);
export default router;
