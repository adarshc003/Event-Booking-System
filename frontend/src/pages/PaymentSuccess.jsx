import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PaymentSuccess() {
  const navigate = useNavigate();
  const hasSaved = useRef(false); 

  useEffect(() => {
    if (hasSaved.current) return; 
    hasSaved.current = true;

    const saveBooking = async () => {
      const data = JSON.parse(
        localStorage.getItem("pendingBooking")
      );

      if (!data) {
        navigate("/events");
        return;
      }

      try {
        await API.post("/bookings", data);
        localStorage.removeItem("pendingBooking");
        navigate("/my-bookings");
      } catch (err) {
        console.error("Booking save failed", err);
      }
    };

    saveBooking();
  }, [navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Payment Successful 🎉</h2>
      <p>Saving your booking...</p>
    </div>
  );
}

export default PaymentSuccess;
