import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    secretKey: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
  await API.post("/auth/register", {
  name: form.name,
  email: form.email,
  phone: form.phone,  
  password: form.password,
  role,
  secretKey: role === "admin" ? form.secretKey : undefined,
});


      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate(`/login/${role}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          {role === "admin" ? "Admin Registration" : "User Registration"}
        </h2>

        <p className="auth-subtitle">
          Create your account to continue
        </p>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

         <input
  type="text"
  name="phone"
  placeholder="Phone Number"
  required
  value={form.phone}
  onChange={handleChange}
/>



          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {role === "admin" && (
            <input
              type="text"
              name="secretKey"
              placeholder="Admin Secret Key"
              required
              value={form.secretKey}
              onChange={handleChange}
            />
          )}

          <button type="submit">Register</button>
        </form>

      
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to={`/login/${role}`}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
