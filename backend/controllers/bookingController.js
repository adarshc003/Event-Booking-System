const Booking = require("../models/Booking");
const Event = require("../models/Event");

const generateBookingId = () =>
  `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// BOOK EVENT 
const bookEvent = async (req, res) => {
  try {
    const { eventId, seatsBooked, paymentMethod } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (seatsBooked > event.seatsAvailable) {
      return res
        .status(400)
        .json({ message: "Not enough seats available" });
    }

    // Reduce seats
    event.seatsAvailable -= seatsBooked;
    await event.save();

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      user: req.user.id,
      event: eventId,
      seatsBooked,
      paymentMethod,
      paymentStatus: "PAID",
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// USER BOOKINGS 
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
     .populate("event", "title location price eventDateTime date")

      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

//ADMIN BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event user")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookEvent,
  getMyBookings,
  getAllBookings,
};
