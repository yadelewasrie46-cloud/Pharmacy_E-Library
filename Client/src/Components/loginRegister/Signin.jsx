import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Signin() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return alert(data.msg || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setIsLoading(false);
      alert("Successfully logged in!");
      navigate("/");

    } catch (error) {
      setIsLoading(false);
      return alert("Network Error: " + error.message);
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h2 className="signin-title">Login To Access Info</h2>

        <div className="input-group">
          <label className="input-label">E-mail:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleChange}
            className={`input-field${errors.email ? ' input-error' : ''}`}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label className="input-label">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleChange}
            className={`input-field${errors.password ? ' input-error' : ''}`}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="signin-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div>
          If you haven't an account please <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Signin;