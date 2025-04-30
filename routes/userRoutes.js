const express = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin only
router.get("/", protect, adminProtect, getUsers);
router.get("/:id", protect, adminProtect, getUserById); // new added
router.put("/:id", protect, adminProtect, updateUser);
router.delete("/:id", protect, adminProtect, deleteUser);

module.exports = router;