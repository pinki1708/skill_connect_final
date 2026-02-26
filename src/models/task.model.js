// src/models/task.model.js
const pool = require("../config/db");

async function createTask({
  project_id,
  title,
  description,
  assigned_to,
  due_date,
}) {
  const result = await pool.query(
    `INSERT INTO tasks (project_id, title, description, assigned_to, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [project_id, title, description, assigned_to || null, due_date || null]
  );
  return result.rows[0];
}

async function getTasksByProject(project_id) {
  const result = await pool.query(
    `SELECT t.*, u.name AS assigned_to_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.user_id
     WHERE t.project_id = $1
     ORDER BY t.created_at`,
    [project_id]
  );
  return result.rows;
}

async function updateTaskStatus(task_id, status) {
  const result = await pool.query(
    `UPDATE tasks
     SET status = $1,
         updated_at = NOW()
     WHERE task_id = $2
     RETURNING *`,
    [status, task_id]
  );
  return result.rows[0];
}

async function assignTask(task_id, user_id) {
  const result = await pool.query(
    `UPDATE tasks
     SET assigned_to = $1,
         updated_at = NOW()
     WHERE task_id = $2
     RETURNING *`,
    [user_id, task_id]
  );
  return result.rows[0];
}

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  assignTask,
};
