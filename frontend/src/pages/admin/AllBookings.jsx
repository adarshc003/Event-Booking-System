import { useEffect, useState } from "react";
import API from "../../services/api";

function AllBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      alert("Failed to load bookings");
    }
  };

  return (
    <div className="events-container">
      <h2>All Bookings</h2>

      <div className="event-grid">
        {bookings.map((b) => (
          <div className="event-card" key={b._id}>
            <h3>{b.event?.title}</h3>
            <p><b>Booking ID:</b> {b.bookingId}</p>
            <p><b>User:</b> {b.user?.name}</p>
            <p><b>Email:</b> {b.user?.email}</p>
            <p><b>Seats:</b> {b.seatsBooked}</p>
            <p><b>Status:</b> {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBookings;
