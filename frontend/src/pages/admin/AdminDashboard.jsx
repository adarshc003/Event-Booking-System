import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div
        className="event-grid"
        style={{ gap: "28px" }}  
      >
        {/* MANAGE EVENTS */}
        <div
          className="event-card"
          style={{
            cursor: "pointer",
            padding: "26px",    
          }}
          onClick={() => navigate("/admin/events")}
        >
          <h3 style={{ fontSize: "18px" }}>Manage Events</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
            Add, view and delete events
          </p>
        </div>

        {/* VIEW ALL BOOKINGS */}
        <div
          className="event-card"
          style={{
            cursor: "pointer",
            padding: "26px",
          }}
          onClick={() => navigate("/admin/bookings")}
        >
          <h3 style={{ fontSize: "18px" }}>View All Bookings</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
            See all user bookings
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
