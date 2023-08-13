import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getInfoGraph,
  createInfoGraph,
  deleteInfoGraph,
  updateInfoGraph,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/graphs")
  .post(protect, createInfoGraph)
  .put(protect, updateInfoGraph)
  .delete(protect, deleteInfoGraph);

router.route("/graphs/:userId").get(protect, getInfoGraph);
export default router;
