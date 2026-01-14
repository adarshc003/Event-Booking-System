import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-layout">
      <div className="home-bg">
        <div className="home-overlay">
          <div className="home-hero">
            <h1>Eventora</h1>

            <p>
              Discover, book, and manage events seamlessly.
              A modern platform built for users and administrators.
            </p>

            <div className="home-actions">
              <button onClick={() => navigate("/login/user")}>
                User Login
              </button>

              <button
                className="outline"
                onClick={() => navigate("/login/admin")}
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
