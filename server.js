const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const mobileAuthRoutes = require("./routes/mobileAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const newsRoutes = require("./routes/newsRoutes");
const userRoutes = require("./routes/userRoutes");
//new added for plug routes
const plugRoutes = require('./routes/plugRoutes');

const mqttClient = require('./utils/mqttClient'); // logger;s


// ============================================== for interval
//new
const Plug = require('./models/Plug'); // ✅ import model
const axios = require('axios'); // ✅ import axios
// const mqttClient = require('./utils/mqttClient'); // ✅ import MQTT
// ============================================== for interval
//
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

// plug Routes
app.use('/api/plugs', plugRoutes);

app.get("/", (req, res) => {
  res.send("EcoTrack Backend API is running...");
});

// mqttClient.on('message', (topic, message) => {
//   console.log(`MQTT received on ${topic}:`, message.toString());
// }); // logger;s



// ============================================== for interval

setInterval(async () => {
  const plugs = await Plug.find();
  for (const plug of plugs) {
    try {
      const response = await axios.get(`http://${plug.ip}/cm?cmnd=Status%208`);
      const energy = response.data?.StatusSNS?.ENERGY;

      const payload = JSON.stringify({
        id: plug._id,
        name: plug.name,
        energy: energy || {},
        timestamp: new Date().toISOString(),
      });

      const topic = `ecotrack/plug/${plug._id}/status`;
      mqttClient.publish(topic, payload, (err) => {
        if (err) {
          console.error(`[AUTO] Failed to publish for ${plug.name}:`, err);
        } else {
          console.log(`[AUTO] Published status for ${plug.name} to ${topic}`);
        }
      });

    } catch (err) {
      console.error(`[AUTO] Failed to fetch status for ${plug.name}:`, err.message);
    }
  }
}, 50000); // ✅ every 10 seconds

// ============================================== for interval
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
