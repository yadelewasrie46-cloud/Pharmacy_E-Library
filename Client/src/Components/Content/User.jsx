import React, { useState, useEffect,useCallback } from 'react';
import { Link } from 'react-router-dom';
const API_BASE=import.meta.env.VITE_API_BASE_URL;
function User() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/create`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCustomers(data.links ?? (Array.isArray(data) ? data : []));
    } catch (error) {
      console.log("Failed to fetch data:", error);
      setError(error.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => { fetchCustomerData(); }, [fetchCustomerData]);

  if (loading) return <div className="user-state">Loading customers...</div>;

  if (error) {
    return (
      <div className="user-state user-error">
        <h3>Error loading data</h3>
        <p>{error}</p>
        <button onClick={fetchCustomerData}>Retry</button>
      </div>
    );
  }

  if (!customers.length) return <div className="user-state">No customers found</div>;

  return (
    <div className="Subject-logos" id="logos">
      {customers.map((singleInfo) => (
        <Link
          to={`/${singleInfo.Link}`}
          className="subject-card"          /* ← was id="pharmacology" */
          key={singleInfo.Id}
        >
          <img src={singleInfo.img_url} alt={singleInfo.Link} />
          <span className="cology-link">{singleInfo.Link}</span>
        </Link>
      ))}
    </div>
  );
}

export default User;