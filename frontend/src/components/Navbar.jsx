import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Hide navbar on first page (HOME)
  if (location.pathname === "/") return null;

  // Hide navbar if not logged in
  if (!role) return null;

  return (
    <>
      {/* BRAND BAR */}
      <div className="brand-bar">
        <div className="brand-logo">
  <span className="logo-icon">◉</span> Eventora
</div>

      </div>

      {/* NAV BAR */}
      <div className="nav-bar">
        {/* LEFT SIDE */}
        <div className="nav-left">
          {role === "user" && (
            <>
              <Link to="/events">Events</Link>
              <Link to="/my-bookings">My Bookings</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin">Dashboard</Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          <Link to="/profile">Profile</Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
