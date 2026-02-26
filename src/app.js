// require("dotenv").config(); // Always at top

// const express = require("express");
// const cors = require("cors");

// const authRoutes = require("./routes/auth.routes");
// const userRoutes = require("./routes/user.routes");
// const messageRoutes = require("./routes/message.routes");
// const projectRoutes = require("./routes/project.routes");
// const videoRoutes = require("./routes/video.routes");
// const userRoutes = require("./routes/user.routes");



// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ message: "SkillConnect API is running" });
// });

// // Mount routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/users", userRoutes);

// app.use("/api/videos", videoRoutes);


// // Debug check
// console.log("authRoutes:", typeof authRoutes);
// console.log("userRoutes:", typeof userRoutes);
// console.log("messageRoutes:", typeof messageRoutes);
// console.log("projectRoutes:", typeof projectRoutes);

// module.exports = app;
require("dotenv").config(); // Always at top

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const projectRoutes = require("./routes/project.routes");
const videoRoutes = require("./routes/video.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SkillConnect API is running" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/videos", videoRoutes);

// Debug check
console.log("authRoutes:", typeof authRoutes);
console.log("userRoutes:", typeof userRoutes);
console.log("messageRoutes:", typeof messageRoutes);
console.log("projectRoutes:", typeof projectRoutes);
console.log("videoRoutes:", typeof videoRoutes);

module.exports = app;
