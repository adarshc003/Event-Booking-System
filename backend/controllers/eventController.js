const Event = require("../models/Event");

// ADD EVENT
const addEvent = async (req, res) => {
  try {
    const { date, time } = req.body;

    const eventDateTime = new Date(`${date}T${time}`);
    if (eventDateTime <= new Date()) {
      return res
        .status(400)
        .json({ message: "Event date & time must be in the future" });
    }

    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = req.body.title ?? event.title;
    event.description = req.body.description ?? event.description;
    event.location = req.body.location ?? event.location;
    event.category = req.body.category ?? event.category;
    event.eventDateTime = req.body.eventDateTime ?? event.eventDateTime;
    event.expiryDate = req.body.expiryDate ?? event.expiryDate;
    event.expiryTime = req.body.expiryTime ?? event.expiryTime;
    event.seatsAvailable =
      req.body.seatsAvailable ?? event.seatsAvailable;

    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ALL EVENTS
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  updateEvent
};
