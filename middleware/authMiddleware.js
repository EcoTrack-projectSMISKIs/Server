const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

// General protection middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "user") {
        req.user = await User.findById(decoded.id).select("-password");
      } else if (decoded.role === "admin" || decoded.role === "superadmin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      } else {
        return res.status(401).json({ message: "Not authorized" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Protect Admins only (admin or superadmin)
const adminProtect = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Protect Superadmin only
const superAdminProtect = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Superadmins only." });
  }
};



//
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; //  include role
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { protect, adminProtect, superAdminProtect, verifyToken };