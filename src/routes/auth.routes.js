// src/routes/auth.routes.js
const express = require("express");
const { register, login } = require("../controllers/auth.controllers");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

module.exports = router;
