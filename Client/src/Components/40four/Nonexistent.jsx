import React from "react";
import { Link } from "react-router-dom";
import "./nonexistent.css";

function Nonexistent() {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">The page is not found</h2>
        <p className="notfound-text">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="notfound-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Nonexistent;