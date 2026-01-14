import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my");
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="page-wrapper">
      

      {bookings.length === 0 && (
        <p className="empty-text">No bookings found</p>
      )}

      <div className="booking-grid">
        {bookings.map((b) => (
          <div key={b._id} className="booking-card">
            <div className="booking-header">
              <h3>{b.event?.title || "Event"}</h3>
              <span className="booking-status">PAID</span>
            </div>

            <div className="booking-body">
              <p>
                <b>Location:</b>{" "}
                {b.event?.location || "N/A"}
              </p>

              <p>
                <b>Date:</b>{" "}
                {b.event?.eventDateTime || b.event?.date
                  ? new Date(
                      b.event?.eventDateTime || b.event?.date
                    ).toLocaleString()
                  : "N/A"}
              </p>

              <p>
                <b>Seats:</b> {b.seatsBooked}
              </p>

              <p>
                <b>Price:</b> ₹{b.event?.price || 0}
              </p>
            </div>

            <div className="booking-footer">
              <span>
                <b>Total:</b> ₹
                {(b.event?.price || 0) *
                  (b.seatsBooked || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
