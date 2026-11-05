const dotenv = require("dotenv");
dotenv.config(); // Must be line 1 to load .env

const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./dbConnection/dbConfig");
const userRoute = require("./userRoute/userRoute");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS Setup
// In production, replace cors() with cors({ origin: "https://your-frontend-url.com" })
app.use(cors());

// Test Database Connection
dbConnection.query("SELECT 1")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.log("DB Connection Failed:", err.message);
    // Optional: stop the server if DB fails on startup
    // process.exit(1); 
  });

// Routes
app.use("/api", userRoute);

// Start Server
const PORT = parseInt(process.env.PORT, 10) || 4040;
app.listen(PORT, () => {
  console.log(`I am running on http://localhost:${PORT}`);
});