import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEvent = async (e) => {
  e.preventDefault();

  const category =
    form.category === "other"
      ? form.customCategory
      : form.category;

  await API.post("/events", {
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
  });

  setShowForm(false);
  fetchEvents();
};

  // DELETE EVENT FUNCTION 
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="manage-header">
        <h2 className="page-title">Manage Events</h2>
        <button
          className="add-event-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Event
        </button>
      </div>

      {showForm && (
        <div className="event-modal">
          <h3>Add New Event</h3>

          <form onSubmit={addEvent}>
            <input name="title" placeholder="Event Title" required onChange={handleChange} />
            <textarea name="description" placeholder="Description" required onChange={handleChange} />
            <input name="location" placeholder="Location" required onChange={handleChange} />

            <select name="category" required onChange={handleChange}>
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
                required
                onChange={handleChange}
              />
            )}
            

            <input type="date" name="date" required onChange={handleChange} />
            <input type="time" name="time" required onChange={handleChange} />

            <label style={{ fontSize: "14px" }}>Booking Expiry (optional)</label>
            <input type="date" name="expiryDate" onChange={handleChange} />
            <input type="time" name="expiryTime" onChange={handleChange} />

<div className="form-group">
  <label>Ticket Price (₹)</label>
  <input
    type="number"
    name="price"
    placeholder="Enter ticket price"
    value={form.price}
    onChange={handleChange}
    min="0"
    required
  />
</div>



        <div className="form-group">
  <label>Available Seats</label>
  <input
    type="number"
    name="seatsAvailable"
    placeholder="Available Seats"
    min="1"
    required
    onChange={handleChange}
  />
</div>


            <div className="form-actions">
              <button type="submit">Save Event</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        
      )}
      

      {/* EVENT LIST WITH DELETE */}
      <div className="event-grid">
        {events.map((e) => (
          <div className="event-card admin-event-card" key={e._id}>
            <h3>{e.title}</h3>
            <p>{e.location}</p>
            <p>{e.category}</p>
            <p>{new Date(e.eventDateTime).toLocaleString()}</p>
            <p>Seats: {e.seatsAvailable}</p>

            <button
              className="delete-btn"
              onClick={() => deleteEvent(e._id)}
            >
              Delete Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminEvents;
