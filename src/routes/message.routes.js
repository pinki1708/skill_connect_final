// src/routes/message.routes.js
const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/message.controller");

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:userId", auth, getMessages);

module.exports = router;
