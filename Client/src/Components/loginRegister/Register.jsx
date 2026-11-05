 import React, { useState } from 'react';
 import {Link,useNavigate} from "react-router-dom";
import "./register.css";
const API_BASE= import.meta.env.VITE_API_BASE_URL;
const RegisterForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
const [errors, setErrors] = useState({});
  

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for that field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/register`, {
       method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)});
  if (!response.ok) {
  const err = await response.json().catch(() => ({}));
  throw new Error(err.msg || `Request failed: ${response.status}`);
}

    const data = await response.json();
    alert(data.msg);
    navigate("/login");
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2 className="form-title">Create an Account</h2>
      <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'input-error' : ''}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'input-error' : ''}
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'input-error' : ''}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>
        <div>If you an account please <Link to={"/login"}>Login</Link></div>
        
      </form>
      
    </div>
  );
};

export default RegisterForm;