const express = require("express");
const {
  getAllNews,
  addNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public (users and guests)
router.get("/", getAllNews);

// Admin only
router.post("/", protect, adminProtect, addNews);
router.put("/:id", protect, adminProtect, updateNews);
router.delete("/:id", protect, adminProtect, deleteNews);

module.exports = router;