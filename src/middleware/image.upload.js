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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB images only
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Image files only!"), false);
    }
  },
});

const uploadImageToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: "image",
      folder: "skillconnect/profiles",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
        { width: 500, height: 500, crop: "fill", gravity: "auto" }
      ],
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary error:", error);
        return res.status(500).json({ error: error.message });
      }
      req.profileImageUrl = result.secure_url;
      req.originalImageUrl = result.eager?.[0]?.secure_url || result.secure_url;
      next();
    }
  );
  
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = { upload, uploadImageToCloudinary };
