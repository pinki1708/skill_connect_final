const express = require("express");
const cors = require("cors");
const path = require('path');

// App create FIRST
const app = express();

// Middleware FIRST
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads (ONCE ONLY)
app.use("/uploads", express.static("uploads"));

// Routes import AFTER app
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profileRoutes");
const messageRoutes = require("./routes/messageRoutes");
const mediaRoutes = require("./routes/mediaRoutes"); 
const userRoutes = require('./routes/userRoutes');
const otherProfileRoutes = require("./routes/otherprofileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoutes");  // ONE TIME ONLY

// API Root Route (MANDATORY)
app.get("/api/", (req, res) => {
  res.json({ 
    message: "SkillConnect API is running 🚀",
    port: 8000,
    endpoints: ["/api/courses", "/api/videos", "/api/auth"]
  });
});

// API Routes (NO DUPLICATES)
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/media", mediaRoutes); 
app.use("/api/messages", messageRoutes);
app.use('/api/users', userRoutes);
app.use("/api/other-profile", otherProfileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/courses", courseRoutes);      // ONE TIME
app.use("/api/videos", videoRoutes);        // ONE TIME ONLY

module.exports = app;
