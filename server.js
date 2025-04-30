const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const mobileAuthRoutes = require("./routes/mobileAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const newsRoutes = require("./routes/newsRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth/mobile", mobileAuthRoutes);    // Mobile auth (register/login/otp)
app.use("/api/auth/admin", adminAuthRoutes);       // Admin auth (login/manage admins)
app.use("/api/news", newsRoutes);                  // News fetch/create/update/delete
app.use("/api/users", userRoutes);                 // User management (admin)

app.get("/", (req, res) => {
  res.send("EcoTrack Backend API is running...");
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
