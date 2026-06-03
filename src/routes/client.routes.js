const express = require("express");
const router = express.Router();

const {
  createClient,
  getClients,
  updateClient,
} = require("../controllers/client.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// CREATE CLIENT
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createClient
);

// GET CLIENTS
router.get(
  "/",
  authMiddleware,
  getClients
);

// UPDATE CLIENT
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateClient
);

module.exports = router;