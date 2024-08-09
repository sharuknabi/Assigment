const express = require("express");
const {
  login,
  getData,
  approveData,
  rejectData,
} = require("../controller/User-controller");
const { authenticateToken } = require("../middleware/Auth");

const router = express.Router();

// User login
router.post("/login", login);

// Protected route to get all data
router.get("/data", authenticateToken, getData);

// Admin route to approve/reject data
router.patch("/data/:id/approve", authenticateToken, approveData);
router.delete("/data/:id/reject", authenticateToken, rejectData);

module.exports = router;
