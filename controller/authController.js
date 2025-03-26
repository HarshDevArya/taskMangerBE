// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with the hashed password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, //secrate key
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      // Uncomment the next line in production when using HTTPS:
      secure: true,
      sameSite: "None",
      maxAge: 3600000, // 1 hour
    });
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.getuser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user1", userId);
    const user = await User.findById(userId).select("-password");
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // If needed, you can re-fetch from DB to ensure fresh data:
    // const userFromDb = await User.findById(req.user._id);

    // Send the user object back
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.signOutUser = async (req, res) => {
  console.log("logOut");
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    status: "ok",
    message: "Sign out successful",
  });
};
