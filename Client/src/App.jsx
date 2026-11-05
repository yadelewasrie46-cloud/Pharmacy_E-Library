import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Layout from "./Components/Layout";
import Descripition from "./Components/Descripition/descripition"
import User from "./Components/Content/User";
import Cology from "./Components/Content/Cology";
import Nonexistent from "./Components/40four/Nonexistent";
import Video from "./Components/Videos/Video";
import Note from "./Components/Notes/Note";
import About from "./Components/Footer/About";
import Terms_of_services from "./Components/Footer/Terms_of_services";
import Admin from "./Components/Admin/Admin";
import "./App.css"
import "./Components/loginRegister/login.css"
import Register from "./Components/loginRegister/Register";
import Signin from "./Components/loginRegister/Signin";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
   const navigate = useNavigate();
  const location = useLocation(); // 👈 Get the current URL path
  const [username, setUsername] =useState("");

  useEffect(() => {
    async function checkuser() {
      const token = localStorage.getItem("token");

      // 🟢 FIX: If no token, only redirect to login if they are NOT already on register/login
      if (!token) {
        if (location.pathname !== "/register" && location.pathname !== "/login") {
          navigate("/login");
        }
        return;
      }

      try {
        let response = await fetch(`${API_BASE}/api/check`, {
          method: "GET",
          headers: { Authorization: 'Bearer ' + token }
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          if (location.pathname !== "/register" && location.pathname !== "/login") {
            navigate("/login");
          }
          return;
        }

        let data = await response.json();
        setUsername(data.username); 
        console.log(data);
        
      } catch (error) {
        console.log("Network error:", error.message);
      }
    }
    checkuser();
  }, [navigate, location.pathname]);
  return (
    <Routes>
      <Route path="/register" element={<><Register/></>}></Route>
      <Route path="/login" element={<><Signin /></>}></Route>
           <Route element={<Layout username={username}/>}>
        <Route path="/" element={<><Descripition /><User /></>} />
        <Route path="/About us" element={<><About/></>} />
        <Route path="/Terms of Service" element={<><Terms_of_services /></>} />
        <Route path="/Videos" element={<Video />} />
        <Route path="/Notes" element={<Note />} />
        <Route path="/dashboard" element={<><Admin/></>} />
        
        {/* Keep the dynamic route above the catch-all */}
        <Route path="/:specSub" element={<><br /><br /><Cology /></>} />
        
        {/* The Catch-All MUST be the absolute last route inside the Layout */}
        <Route path="*" element={<Nonexistent />} />
      </Route>
    </Routes>
  );
}