const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const sendEmail = require("../utils/sendEmail");


const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;


// REGISTER 
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, secretKey } = req.body;

// FIRST NAME SPACE LAST NAME VALIDATION
const nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;

if (!nameRegex.test(name)) {
  return res.status(400).json({
    message: "Name must be in FirstName LastName format (letters only)",
  });
}


    // EMAIL VALIDATION (@gmail.com only)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email must be a valid @gmail.com address",
      });
    }

    // PHONE VALIDATION
const phoneRegex = /^[0-9]{10}$/;
if (!phoneRegex.test(phone)) {
  return res.status(400).json({
    message: "Phone number must be exactly 10 digits",
  });
}


    // ADMIN SECRET KEY
    if (role === "admin" && secretKey !== ADMIN_SECRET) {
      return res.status(401).json({
        message: "Invalid admin secret key",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ADMIN → DIRECT LOGIN (NO OTP)
    if (user.role === "admin") {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Admin login successful",
        token,
        role: user.role,
        isOtpRequired: false,
      });
    }

    // USER → OTP REQUIRED
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      "Your Login OTP",
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.json({
      message: "OTP sent to your email",
      userId: user._id,
      isOtpRequired: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VERIFY OTP 
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    console.log("VERIFY OTP BODY 👉", req.body);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR ❌", err);
    res.status(500).json({ message: err.message });
  }
});



// GET PROFILE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//UPDATE PROFILE
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { phone, place } = req.body;

    const phoneRegex = /^[0-9]{10}$/;
    const placeRegex = /^[A-Za-z ]{2,}$/;

    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }

    if (place && !placeRegex.test(place)) {
      return res.status(400).json({
        message: "Place must contain only letters and spaces",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { phone, place },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
