const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmailToMultipleRecipients } = require("../utils/sendEmail");

// Generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id, admin.role);

    res.json({
      token,
      role: admin.role, // include role in response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Profile (View)
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Profile (Update)
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    // 
    // test
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    await admin.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Superadmin: Create Admin
exports.createAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Superadmin: Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Superadmin: Update Admin
exports.updateAdminById = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.role === "superadmin") {
      return res.status(403).json({ message: "Cannot modify superadmin" });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    await admin.save();
    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Superadmin: Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await admin.deleteOne();
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send Email Campaign to Admins
exports.sendEmailCampaign = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required." });
  }

  try {
    const admins = await Admin.find({ role: "admin" }, "email name");
    const emailList = admins.map((admin) => admin.email);

    const htmlContent = `
      <div style="font-family: sans-serif;">
        <h2>${subject}</h2>
        <p>${message}</p>
      </div>
    `;

    await sendEmailToMultipleRecipients(emailList, subject, htmlContent);
    res.status(200).json({ message: "Emails sent successfully." });
  } catch (error) {
    console.error("Error sending campaign:", error.message);
    res.status(500).json({ message: "Failed to send emails." });
  }
};