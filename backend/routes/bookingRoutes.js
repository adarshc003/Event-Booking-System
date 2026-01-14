const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  bookEvent,
  getMyBookings,
  getAllBookings,
} = require("../controllers/bookingController");

// BOOK EVENT
router.post("/", verifyToken, bookEvent);

// USER BOOKINGS
router.get("/my", verifyToken, getMyBookings);

// ADMIN BOOKINGS
router.get("/all", verifyToken, getAllBookings);

module.exports = router;
