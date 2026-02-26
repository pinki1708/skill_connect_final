// // src/controllers/video.controller.js
// const { pool } = require("../config/db");

// exports.uploadVideo = async (req, res) => {
//   try {
//     // Safe user_id access
//     const owner_id = req.user?.user_id || 1; // Fallback to 1
//     const { title, description } = req.body;
//     const video_url = req.videoUrl;
//     const thumbnail_url = req.thumbnailUrl;

//     console.log("Upload data:", { owner_id, title, video_url }); // Debug

//     if (!title || !video_url) {
//       return res.status(400).json({ error: "Title and video URL required" });
//     }

//     const result = await pool.query(
//       `INSERT INTO videos (owner_id, title, description, video_url, thumbnail_url)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [owner_id, title, description || "", video_url, thumbnail_url]
//     );

//     res.status(201).json({
//       message: "✅ Video uploaded successfully!",
//       video: result.rows[0]
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getVideos = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT v.*, u.name as owner_name 
//       FROM videos v 
//       JOIN users u ON v.owner_id = u.user_id 
//       ORDER BY v.uploaded_at DESC
//     `);
//     res.json({ videos: result.rows });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getVideoById = async (req, res) => {
//   // Implementation later
//   res.json({ message: "Single video endpoint" });
// };
const { pool } = require("../config/db");

exports.uploadVideo = async (req, res) => {
  try {
    const owner_id = req.user?.user_id || 1;
    const { title, description } = req.body;
    const video_url = req.videoUrl;
    const thumbnail_url = req.thumbnailUrl;

    console.log("✅ Upload SUCCESS:", { owner_id, title, video_url });

    // Skip DB temporarily - Direct response
    res.status(201).json({
      success: true,
      message: "🎥 Video uploaded to Cloudinary SUCCESSFULLY!",
      data: {
        title,
        description: description || "",
        video_url,
        thumbnail_url: thumbnail_url || null,
        owner_id,
        cloudinary_id: video_url.split("/").pop()?.split(".")[0]
      }
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getVideos = async (req, res) => res.json({ videos: [] });
exports.getVideoById = async (req, res) => res.json({ id: req.params.id });
