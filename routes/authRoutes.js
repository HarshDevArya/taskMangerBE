// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, getuser } = require("../controller/authController");
const protected = require("../middleware/requireAuth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/current-user", protected, getuser);

module.exports = router;
