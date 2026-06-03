const pool = require("../config/db");

// CREATE CLIENT
const createClient = async (req, res) => {
  const { name, email, company, phone , status,} = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO clients (name, email, company, phone, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [name, email, company, phone, status, req.user.id]
    );

    res.status(201).json({
      message: "Client created successfully",
      client: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL CLIENTS
const getClients = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM clients
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE CLIENT
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, company, phone, status } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE clients
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          company = COALESCE($3, company),
          phone = COALESCE($4, phone),
          status = COALESCE($5, status)
      WHERE id = $6
      RETURNING *
      `,
      [name, email, company, phone, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      message: "Client updated successfully",
      client: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createClient,
  getClients,
  updateClient,
};