import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [errors, setErrors] = useState({});


  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    customCategory: "",
    price: "",
    date: "",
    time: "",
    expiryDate: "",
    expiryTime: "",
    seatsAvailable: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // FETCH EVENTS
  const fetchEvents = async () => {
    const res = await API.get("/events/all");
    setEvents(res.data);
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // OPEN ADD
  const openAddModal = () => {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      location: "",
      category: "",
      customCategory: "",
      date: "",
      time: "",
      expiryDate: "",
      expiryTime: "",
      seatsAvailable: "",
    });
    setShowModal(true);
  };

  // OPEN EDIT
  const openEditModal = (event) => {
    setEditingEvent(event);

    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      customCategory: "",
       price: event.price || "", 
      date: event.date,
      time: event.time,
      expiryDate: event.expiryDate || "",
      expiryTime: event.expiryTime || "",
      seatsAvailable: event.seatsAvailable,
    });

    setShowModal(true);
  };

const validateForm = () => {
  const newErrors = {};
  const now = new Date();

  
  if (!form.title.trim()) newErrors.title = "Event title is required";
  if (!form.description.trim()) newErrors.description = "Description is required";
  if (!form.location.trim()) newErrors.location = "Location is required";
  if (!form.category) newErrors.category = "Category is required";

  // Price
  if (form.price === "" || Number(form.price) < 0) {
    newErrors.price = "Price must be 0 or greater";
  }

  // Seats
  if (!form.seatsAvailable || Number(form.seatsAvailable) < 1) {
    newErrors.seatsAvailable = "Seats must be at least 1";
  }

  // Date & time
  if (!form.date) newErrors.date = "Event date is required";
  if (!form.time) newErrors.time = "Event time is required";

  if (form.date && form.time) {
    const eventDateTime = new Date(`${form.date}T${form.time}`);
    if (eventDateTime < now) {
      newErrors.date = "Event date & time cannot be in the past";
    }
  }

  // Booking expiry
  if (form.expiryDate && form.expiryTime && form.date && form.time) {
    const expiry = new Date(`${form.expiryDate}T${form.expiryTime}`);
    const eventDT = new Date(`${form.date}T${form.time}`);

    if (expiry > eventDT) {
      newErrors.expiryDate = "Expiry must be before event date & time";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // SAVE (ADD / EDIT)
  const saveEvent = async () => {
  if (!validateForm()) return;

  const category =
    form.category === "other"
      ? form.customCategory
      : form.category;

  const payload = {
    title: form.title,
    description: form.description,
    location: form.location,
    category,
    price: Number(form.price),
    date: form.date,
    time: form.time,
    expiryDate: form.expiryDate,
    expiryTime: form.expiryTime,
    seatsAvailable: Number(form.seatsAvailable),
  };

  if (editingEvent) {
    await API.put(`/events/${editingEvent._id}`, payload);
  } else {
    await API.post("/events", payload);
  }

  setErrors({});
  setShowModal(false);
  fetchEvents();
};


  // DELETE
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await API.delete(`/events/${id}`);
    fetchEvents();
  };

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="manage-header">
        
        <button className="add-event-btn" onClick={openAddModal}>
          + Add Event
        </button>
      </div>

      {/* EVENTS LIST */}
      <div className="event-grid">
        {events.map((e) => (
          <div className="event-card admin-event-card" key={e._id}>
            <h3>{e.title}</h3>
            <p>{e.location}</p>
            <p>{e.category}</p>
            <p>{new Date(e.eventDateTime).toLocaleString()}</p>
            <p>Seats: {e.seatsAvailable}</p>

            <div className="admin-event-actions">
  <button
    className="edit-btn"
    onClick={() => openEditModal(e)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteEvent(e._id)}
  >
    Delete
  </button>
</div>

          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="event-modal">
            <h2>
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>

<div className="event-form">

            <input
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <small className="form-error">{errors.title}</small>}

            <textarea
              name="description"
              placeholder="Event Description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Music">Music</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
              <option value="other">Other</option>
            </select>

            {form.category === "other" && (
              <input
                name="customCategory"
                placeholder="Custom Category"
                value={form.customCategory}
                onChange={handleChange}
              />
            )}

            <input
  type="number"
  name="price"
  placeholder="Ticket Price (₹)"
  value={form.price}
  onChange={handleChange}
  min="0"
  required
/>
{errors.price && <small className="form-error">{errors.price}</small>}
</div>


            <input type="date" name="date" value={form.date} onChange={handleChange} />
            {errors.date && <small className="form-error">{errors.date}</small>}

            <input type="time" name="time" value={form.time} onChange={handleChange} />
{errors.time && <small className="form-error">{errors.time}</small>}

            <label>Booking Expiry (optional)</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
            />
            <input
              type="time"
              name="expiryTime"
              value={form.expiryTime}
              onChange={handleChange}
            />

            <input
              type="number"
              name="seatsAvailable"
              placeholder="Available Seats"
              value={form.seatsAvailable}
              onChange={handleChange}
            />
            {errors.seatsAvailable && (
  <small className="form-error">{errors.seatsAvailable}</small>
)}

            <div className="form-actions">
              <button onClick={saveEvent}>
                {editingEvent ? "Update Event" : "Save Event"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}

export default AdminEvents;
