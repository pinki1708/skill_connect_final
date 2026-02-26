// src/models/application.model.js
const pool = require("../config/db");

/**
 * Create new application for a project
 * @param {Object} data
 * @param {number} data.project_id
 * @param {number} data.applicant_id
 * @param {string} data.message
 * @returns {Promise<Object>} created application row
 */
async function createApplication({ project_id, applicant_id, message }) {
  const result = await pool.query(
    `INSERT INTO project_applications (project_id, applicant_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [project_id, applicant_id, message]
  );
  return result.rows[0];
}

/**
 * Get all applications for a project
 * @param {number} project_id
 * @returns {Promise<Array>} list of applications
 */
async function getApplicationsByProject(project_id) {
  const result = await pool.query(
    `SELECT pa.*, u.name AS applicant_name
     FROM project_applications pa
     JOIN users u ON pa.applicant_id = u.user_id
     WHERE pa.project_id = $1
     ORDER BY pa.created_at DESC`,
    [project_id]
  );
  return result.rows;
}

/**
 * Get applications submitted by a user
 * @param {number} applicant_id
 * @returns {Promise<Array>}
 */
async function getApplicationsByUser(applicant_id) {
  const result = await pool.query(
    `SELECT pa.*, p.title AS project_title
     FROM project_applications pa
     JOIN projects p ON pa.project_id = p.project_id
     WHERE pa.applicant_id = $1
     ORDER BY pa.created_at DESC`,
    [applicant_id]
  );
  return result.rows;
}

/**
 * Update application status (pending / accepted / rejected / withdrawn)
 * @param {number} application_id
 * @param {string} status
 * @returns {Promise<Object>} updated row
 */
async function updateApplicationStatus(application_id, status) {
  const result = await pool.query(
    `UPDATE project_applications
     SET status = $1
     WHERE application_id = $2
     RETURNING *`,
    [status, application_id]
  );
  return result.rows[0];
}

module.exports = {
  createApplication,
  getApplicationsByProject,
  getApplicationsByUser,
  updateApplicationStatus,
};
