// middleware/video.upload.js (jo tune banaya)
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ✅ Already correct config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB ✅
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) { 
      cb(null, true);
    } else {
      cb(new Error("Video files only!"), false); 
    }
  },
});

// ✅ Cloudinary upload middleware
const uploadVideoToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: "video", 
      folder: "skillconnect/videos", 
      transformation: [{ quality: "auto:good" }], 
    },
    (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      req.videoUrl = result.secure_url; 
      req.thumbnailUrl = result.eager?.[0]?.secure_url || null; 
      next();
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = { upload, uploadVideoToCloudinary };
