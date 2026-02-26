const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  createProject,
  listProjects,
  applyProject,
} = require("../controllers/project.controller.js");

const router = express.Router();

// POST /api/projects
router.post("/", auth, createProject);

// GET /api/projects
router.get("/", listProjects);

// POST /api/projects/:id/apply
router.post("/:id/apply", auth, applyProject);

module.exports = router;
