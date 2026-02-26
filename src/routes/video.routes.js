// src/routes/video.routes.js
const express = require("express");
const auth = require("../middleware/auth.middleware");
const { upload, uploadVideoToCloudinary } = require("../middleware/video.upload");
const { uploadVideo, getVideos, getVideoById } = require("../controllers/video.controller");

const router = express.Router();

// POST /api/videos - Upload video (multipart form-data)
router.post(
  "/",
  auth,
  upload.single("video"),
  uploadVideoToCloudinary,
  uploadVideo
);

// GET /api/videos - List all videos (skill filter)
router.get("/", getVideos);

// GET /api/videos/:id - Single video
router.get("/:id", getVideoById);

module.exports = router;
