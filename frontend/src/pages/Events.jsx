import { useEffect, useState } from "react";
import API from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [seats, setSeats] = useState("");
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, events]);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
    setFilteredEvents(res.data);

    const uniqueCategories = [
      ...new Set(res.data.map((e) => e.category).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
  };

  const applyFilters = () => {
    let temp = [...events];

    if (category !== "all") {
      temp = temp.filter(
        (e) => e.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    setFilteredEvents(temp);
  };

  const openDetails = (event) => {
    setSelectedEvent(event);
    setSeats("");
    setError("");
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setShowPayment(false);
  };

const handleStripePayment = async () => {
  try {
    const price = Number(selectedEvent.price);
    const seatsCount = Number(seats);
    const amount = price * seatsCount;

    if (!seatsCount || seatsCount <= 0) {
      setError("Please select valid seats");
      return;
    }

    // 🆓 FREE EVENT → DIRECT BOOKING (NO STRIPE)
    if (price === 0) {
      try {
        await API.post("/bookings", {
          eventId: selectedEvent._id,
          seatsBooked: seatsCount,
          paymentMethod: "FREE",
        });

        setShowModal(false);
        setShowPayment(false);
        setSeats("");
        setError("");
        alert("Booking successful 🎉");
        return;
      } catch (err) {
        console.error(err);
        setError("Booking failed");
        return;
      }
    }

    // 💰 PAID EVENT → STRIPE FLOW
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        eventId: selectedEvent._id,
        seatsBooked: seatsCount,
        paymentMethod: "CARD",
      })
    );

    const res = await API.post(
      "/payment/create-checkout-session",
      { amount }
    );

    if (!res.data.url) {
      setError("Stripe session not created");
      return;
    }

    window.location.href = res.data.url;
  } catch (err) {
    console.error("PAYMENT ERROR ❌", err);
    setError("Payment failed");
  }
};

  return (
    <div className="page-wrapper">

      {/* FILTER BAR */}
      <div className="filter-wrapper">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name, category or place"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EVENTS */}
      <div className="event-grid">
        {filteredEvents.map((event) => (
          <div key={event._id} className="event-card user-event-card">
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{event.category}</p>
            <p>Seats Available: {event.seatsAvailable}</p>
            <p><b>Price:</b> ₹{event.price}</p>

            <button onClick={() => openDetails(event)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* EVENT DETAILS MODAL */}
      {showModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="event-modal">
            <h2>{selectedEvent.title}</h2>

            <p>{selectedEvent.description}</p>
            <p><b>Location:</b> {selectedEvent.location}</p>
            <p><b>Category:</b> {selectedEvent.category}</p>
            <p><b>Price:</b> ₹{selectedEvent.price}</p>

            {error && <div className="error-msg">{error}</div>}

            {!showPayment ? (
              <div className="booking-box">
                <label>Select Seats</label>
                <input
                  type="number"
                  min="1"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                />
                <button
                  className="pay-btn"
                  onClick={() => setShowPayment(true)}
                >
                  Proceed to Pay
                </button>
              </div>
            ) : (
              <div className="payment-box">
                <p>
                  <b>Total Amount:</b> ₹
                  {selectedEvent.price * Number(seats)}
                </p>

                <button
                  className="pay-btn"
                  onClick={handleStripePayment}
                >
                  Pay with Stripe
                </button>

                <button
                  className="cancel-pay-btn"
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            <button className="close-btn" onClick={closeDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
