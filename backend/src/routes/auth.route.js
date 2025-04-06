import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/check", protectedRoute, checkAuth);
router.post("/forgot-password", forgotPassword); // Route gửi OTP
router.post("/reset-password", resetPassword); // Route reset password
export default router;
