// middleware/requireAuth.js
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // Ensure you have cookie-parser installed and configured in your server
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user data to the request object for later use
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = requireAuth;
