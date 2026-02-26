const pool = require("../config/db");

// GET /api/users/me
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id = $1",
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/users/me  (create or update profile)
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { avatar_url, skills, experience, bio } = req.body;

    const existing = await pool.query(
      "SELECT profile_id FROM user_profiles WHERE user_id = $1",
      [req.user.user_id]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE user_profiles
         SET avatar_url = $1,
             skills = $2,
             experience = $3,
             bio = $4,
             updated_at = NOW()
         WHERE user_id = $5
         RETURNING *`,
        [avatar_url, skills, experience, bio, req.user.user_id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO user_profiles (user_id, avatar_url, skills, experience, bio)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.user.user_id, avatar_url, skills, experience, bio]
      );
    }

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/users?skill=Flutter
exports.searchBySkill = async (req, res) => {
  try {
    const { skill } = req.query;
    if (!skill) {
      return res
        .status(400)
        .json({ message: "skill query param is required" });
    }

    const result = await pool.query(
      `SELECT u.user_id, u.name, up.skills, up.avatar_url
       FROM users u
       JOIN user_profiles up ON u.user_id = up.user_id
       WHERE $1 = ANY(up.skills)`,
      [skill]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update profile image for the current user
exports.updateProfileImage = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const profile_image_url = req.profileImageUrl;

    if (!profile_image_url) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await pool.query(
      "UPDATE users SET profile_image = $1 WHERE user_id = $2 RETURNING user_id, name, email, profile_image, role",
      [profile_image_url, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "✅ Profile image updated successfully!",
      profile_image: profile_image_url,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Profile image error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createUserPost = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { description } = req.body;
    const media_url = req.mediaUrl;
    const media_type = req.mediaType;
    const created_by = req.user.name || "User";

    console.log("Creating post:", { user_id, description, media_url, media_type });

    if (!media_url) {
      return res.status(400).json({ error: "Media file required" });
    }

    const result = await pool.query(
      `INSERT INTO user_posts (user_id, description, created_by, media_url, media_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, description || "", created_by, media_url, media_type]
    );

    res.status(201).json({
      success: true,
      message: "✅ Post created successfully!",
      post: result.rows[0]
    });
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSkills = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    
    // Fetch skills from user_profiles table
    const result = await pool.query(
      `SELECT user_id, skills 
       FROM user_profiles 
       WHERE user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: "User skills not found" 
      });
    }

    // Format response exactly as requested
    const response = {
      userid: parseInt(user_id),
      skills: result.rows[0].skills || []
    };

    res.json(response);
  } catch (err) {
    console.error("Skills fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserSkills = async (req, res) => {
  try {
    const { user_id, skills } = req.body;
    
    console.log("Skills POST:", { user_id, skills });

    if (parseInt(user_id) !== req.user.user_id) {
      return res.status(403).json({ error: "Cannot update other user skills" });
    }

    // Simple UPSERT - only user_id + skills (no created_by/date)
    const result = await pool.query(`
      INSERT INTO user_profiles (user_id, skills)
      VALUES ($1, $2)
      ON CONFLICT (user_id) 
      DO UPDATE SET skills = $2
      RETURNING user_id, skills
    `, [user_id, skills]);

    res.status(201).json({
      success: true,
      message: "✅ Skills updated successfully!",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Skills update error:", err);
    res.status(500).json({ error: err.message });
  }
};


   