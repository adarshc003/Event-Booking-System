const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const verifyToken = require("../middleware/verifyToken");
const { updateEvent } = require("../controllers/eventController");


//USER – ACTIVE EVENTS ONLY
router.get("/", async (req, res) => {
  const now = new Date();

  const events = await Event.find({
    expiryDateTime: { $gt: now },
  }).sort({ eventDateTime: 1 });

  res.json(events);
});

// ADMIN – ALL EVENTS
router.get("/all", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

// ADD EVENT (ADMIN)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const {
    title,
    description,
    location,
    category,
    price,
    date,
    time,
    expiryDate,
    expiryTime,
    seatsAvailable,
  } = req.body;

  const eventDateTime = new Date(`${date}T${time}`);

  let expiryDateTime;
  if (expiryDate && expiryTime) {
    expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
  } else {
    expiryDateTime = eventDateTime;
  }

  if (eventDateTime <= new Date()) {
    return res
      .status(400)
      .json({ message: "Event must be in the future" });
  }

  const event = await Event.create({
    title,
    description,
    location,
    category,
    price,
    eventDateTime,
    expiryDateTime,
    seatsAvailable,
  });

  res.json(event);
});

// DELETE EVENT (ADMIN)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted successfully" });
});
router.put("/:id", verifyToken, updateEvent);


module.exports = router;
