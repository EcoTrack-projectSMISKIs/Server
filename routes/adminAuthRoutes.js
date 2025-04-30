const express = require("express");
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  updateAdminById,
  sendEmailCampaign,
} = require("../controllers/adminAuthController");
const { protect, adminProtect, superAdminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/login", adminLogin);

// Protected (admin or superadmin)
router.get("/profile", protect, adminProtect, getAdminProfile);
router.put("/profile", protect, adminProtect, updateAdminProfile);

// Protected (superadmin only)
router.post("/create", protect, superAdminProtect, createAdmin);
router.get("/all", protect, superAdminProtect, getAllAdmins);
router.delete("/:id", protect, superAdminProtect, deleteAdmin);
router.put("/:id", protect, superAdminProtect, updateAdminById);

// Protected (admin for sending campaigns)
router.post("/send-campaign", protect, adminProtect, sendEmailCampaign);

module.exports = router;