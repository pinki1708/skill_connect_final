// src/models/message.model.js
const pool = require("../config/db");

async function createMessage({ sender_id, receiver_id, content }) {
  const result = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [sender_id, receiver_id, content]
  );
  return result.rows[0];
}

async function getConversation(userId, otherUserId) {
  const result = await pool.query(
    `SELECT * FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY sent_at`,
    [userId, otherUserId]
  );
  return result.rows;
}

module.exports = {
  createMessage,
  getConversation,
};
