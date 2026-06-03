const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
      ["test@gmail.com", hashedPassword, "admin"]
    );

    console.log("User created successfully");
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

createUser();