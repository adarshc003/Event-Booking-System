import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await API.get("/bookings/all");
    setBookings(res.data);
  };

  return (
    <div className="page-wrapper">
      

      {bookings.length === 0 && (
        <p style={{ marginTop: "20px" }}>No bookings found</p>
      )}

      <div className="booking-grid">
        {bookings.map((b) => (
          <div className="booking-card" key={b._id}>
            <div className="booking-header">
              <span className="booking-id">
                #{b.bookingId}
              </span>
              <span className="booking-status">
                {b.status}
              </span>
            </div>

            <div className="booking-section">
              <h4>User</h4>
              <p>{b.user?.name}</p>
              <p className="muted">{b.user?.email}</p>
            </div>

            <div className="booking-section">
              <h4>Event</h4>
              <p>{b.event?.title}</p>
              <p className="muted">{b.event?.location}</p>
              <p className="muted">
                {new Date(
                  b.event?.eventDateTime
                ).toLocaleString()}
              </p>
            </div>

            <div className="booking-footer">
              <span>
                Seats: <b>{b.seatsBooked}</b>
              </span>
              <span className="muted">
                {new Date(b.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBookings;
