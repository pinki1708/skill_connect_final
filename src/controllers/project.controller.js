// // src/controllers/project.controllers.js
// const pool = require("../config/db");

// // POST /api/projects
// exports.createProject = async (req, res) => {
//   try {
//     const { title, description, required_skills } = req.body;

//     const result = await pool.query(
//       `INSERT INTO projects (owner_id, title, description, required_skills)
//        VALUES ($1,$2,$3,$4)
//        RETURNING *`,
//       [req.user.user_id, title, description, required_skills]
//     );

//     return res.status(201).json(result.rows[0]);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// // GET /api/projects
// exports.listProjects = async (req, res) => {
//   try {
//     const { skill } = req.query;
//     let result;

//     if (skill) {
//       result = await pool.query(
//         "SELECT * FROM projects WHERE $1 = ANY(required_skills)",
//         [skill]
//       );
//     } else {
//       result = await pool.query(
//         "SELECT * FROM projects ORDER BY created_at DESC"
//       );
//     }

//     return res.json(result.rows);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// // POST /api/projects/:id/apply
// exports.applyProject = async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const { message } = req.body;

//     const result = await pool.query(
//       `INSERT INTO project_applications (project_id, applicant_id, message)
//        VALUES ($1,$2,$3)
//        RETURNING *`,
//       [projectId, req.user.user_id, message]
//     );

//     return res.status(201).json(result.rows[0]);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
// src/controllers/project.controller.js
const pool = require("../config/db");

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { title, description, required_skills } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const result = await pool.query(
      `INSERT INTO projects (owner_id, title, description, required_skills)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.user_id, title, description, required_skills]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/projects
exports.listProjects = async (req, res) => {
  try {
    const { skill } = req.query;
    let result;

    if (skill) {
      result = await pool.query(
        "SELECT * FROM projects WHERE $1 = ANY(required_skills)",
        [skill]
      );
    } else {
      result = await pool.query(
        "SELECT * FROM projects ORDER BY created_at DESC"
      );
    }

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/projects/:id/apply
exports.applyProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { message } = req.body;

    const result = await pool.query(
      `INSERT INTO project_applications (project_id, applicant_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [projectId, req.user.user_id, message]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
