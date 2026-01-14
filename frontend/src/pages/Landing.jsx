import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

    <div className="landing">
      <div className="landing-card">
        <h1>Welcome to EventBooking</h1>
        <p>
          Discover, book and manage events easily.
          <br />
          Simple • Fast • Secure
        </p>

        <div className="landing-actions">
          <button onClick={() => navigate("/login/user")}>
            Login as User
          </button>
          <button onClick={() => navigate("/login/admin")}>
            Login as Admin
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Landing;
