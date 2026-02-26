// // src/controllers/message.controller.js
// const pool = require("../config/db");

// // POST /api/messages
// exports.sendMessage = async (req, res) => {
//   try {
//     const { receiver_id, content } = req.body;

//     const result = await pool.query(
//       "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1,$2,$3) RETURNING *",
//       [req.user.user_id, receiver_id, content]
//     );

//     return res.status(201).json(result.rows[0]);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// // GET /api/messages/:userId
// exports.getMessages = async (req, res) => {
//   try {
//     const otherUserId = req.params.userId;

//     const result = await pool.query(
//       `SELECT * FROM messages
//        WHERE (sender_id = $1 AND receiver_id = $2)
//           OR (sender_id = $2 AND receiver_id = $1)
//        ORDER BY sent_at`,
//       [req.user.user_id, otherUserId]
//     );

//     return res.json(result.rows);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
// src/controllers/message.controller.js
const pool = require("../config/db");

// POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res
        .status(400)
        .json({ message: "receiver_id and content are required" });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.user_id, receiver_id, content]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/:userId
exports.getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY sent_at`,
      [req.user.user_id, otherUserId]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
