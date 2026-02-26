// src/models/user.model.js
const pool = require("../config/db");

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(user_id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [user_id]
  );
  return result.rows[0] || null;
}

async function createUser({ name, email, password_hash, role = "user" }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, email, role`,
    [name, email, password_hash, role]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
