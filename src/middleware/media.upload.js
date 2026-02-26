const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Images/Videos only!"), false);
    }
  },
});

const uploadMediaToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  
  const isVideo = req.file.mimetype.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";
  const folder = isVideo ? "skillconnect/posts/videos" : "skillconnect/posts/images";
  
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: resourceType,
      folder,
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ],
    },
    (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      req.mediaUrl = result.secure_url;
      req.mediaType = isVideo ? "video" : "image";
      next();
    }
  );
  
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = { upload, uploadMediaToCloudinary };
