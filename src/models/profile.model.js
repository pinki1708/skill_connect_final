// src/models/profile.model.js
const pool = require("../config/db");

async function getProfileByUserId(user_id) {
  const result = await pool.query(
    "SELECT * FROM user_profiles WHERE user_id = $1",
    [user_id]
  );
  return result.rows[0] || null;
}

async function createProfile({ user_id, avatar_url, skills, experience, bio }) {
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, avatar_url, skills, experience, bio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, avatar_url, skills, experience, bio]
  );
  return result.rows[0];
}

async function updateProfile({ user_id, avatar_url, skills, experience, bio }) {
  const result = await pool.query(
    `UPDATE user_profiles
     SET avatar_url = $1,
         skills = $2,
         experience = $3,
         bio = $4,
         updated_at = NOW()
     WHERE user_id = $5
     RETURNING *`,
    [avatar_url, skills, experience, bio, user_id]
  );
  return result.rows[0];
}

async function searchProfilesBySkill(skill) {
  const result = await pool.query(
    `SELECT u.user_id, u.name, up.skills, up.avatar_url
     FROM users u
     JOIN user_profiles up ON u.user_id = up.user_id
     WHERE $1 = ANY(up.skills)`,
    [skill]
  );
  return result.rows;
}

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
  searchProfilesBySkill,
};
