const pool = require("../config/db");

// CREATE TASK
const createTask = async (req, res) => {
  const {
    title,
    description,
    status,
    due_date,
    client_id,
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO tasks
      (title, description, status, due_date, client_id, assigned_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        title,
        description,
        status || "todo",
        due_date,
        client_id,
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Task created successfully",
      task: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET TASKS
const getTasks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tasks.*,
        clients.name AS client_name
      FROM tasks
      JOIN clients
      ON tasks.client_id = clients.id
      ORDER BY tasks.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
};