import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  // EMAIL + PASSWORD
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await API.post("/auth/login", { email, password });

    // 🔐 SAFETY CHECK
    if (!res || !res.data) {
      setError("Invalid server response");
      return;
    }

    const {
      isOtpRequired,
      token,
      role,
      userId,
    } = res.data;

    // ADMIN → DIRECT LOGIN (NO OTP)
    if (isOtpRequired === false) {
      if (!token || !role) {
        setError("Admin login failed");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/admin");
      return;
    }

    // 🔐 USER → OTP REQUIRED
    if (isOtpRequired === true) {
      if (!userId) {
        setError("OTP userId missing");
        return;
      }

      setUserId(userId);
      setOtpStep(true);
      return;
    }

    // FALLBACK
    setError("Unexpected login response");
  } catch (err) {
    console.error("LOGIN ERROR ❌", err);
    setError(err.response?.data?.message || "Login failed");
  }
};


  // OTP VERIFY
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/verify-otp", {
        userId,
        otp: otp.toString(), 
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Navigate AFTER OTP verification
      res.data.role === "admin"
        ? navigate("/admin")
        : navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="no-scroll-page auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>{role === "admin" ? "Admin Login" : "User Login"}</h2>
          <p className="auth-subtitle">
            Sign in to continue to EventBooking
          </p>

          {/* SHOW ERROR */}
          {error && <div className="error-msg">{error}</div>}

          {!otpStep ? (
            // 🔐 LOGIN FORM
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Login</button>
            </form>
          ) : (
            // OTP FORM
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button type="submit">Verify OTP</button>
            </form>
          )}

          <p className="auth-switch">
            Don’t have an account?{" "}
            <Link to={`/register/${role}`}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
