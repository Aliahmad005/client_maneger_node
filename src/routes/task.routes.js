const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
} = require("../controllers/task.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// CREATE TASK
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createTask
);

// GET TASKS
router.get(
  "/",
  authMiddleware,
  getTasks
);

module.exports = router;