const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  const { name, description, course_id } = req.body;  // ← course_id fix
  const user_id = req.user?.user_id || req.user?.userid;  // ← Safe check
  const videoFile = req.file;

  console.log('Upload received:', { name, course_id, hasFile: !!videoFile, user: user_id });

  if (!videoFile) return res.status(400).json({ message: 'Video file required' });
  if (!name) return res.status(400).json({ message: 'Name required' });

  const video_url = `/uploads/${videoFile.filename}`;
  const thumbFileName = `thumb_${Date.now()}.jpg`;
  const thumbnail_url = `/uploads/${thumbFileName}`;

  try {
    const result = await pool.query(
      `INSERT INTO course_videos (course_id, name, description, video_url, thumbnail_url, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [course_id || null, name, description || '', video_url, thumbnail_url, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    fs.unlinkSync(videoFile.path);
    console.error('DB Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all videos by time
exports.getAllVideos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM course_videos ORDER BY created_at DESC'  // ← created_at fix
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get videos by course
exports.getVideosByCourse = async (req, res) => {
  const course_id = req.params.course_id;  // ← course_id fix
  try {
    const result = await pool.query(
      'SELECT * FROM course_videos WHERE course_id = $1 ORDER BY created_at DESC',  // ← fixes
      [course_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
