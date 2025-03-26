// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getuser,
  signOutUser,
} = require("../controller/authController");
const protected = require("../middleware/requireAuth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/current-user", protected, getuser);

router.post("/logout", protected, signOutUser);

module.exports = router;
