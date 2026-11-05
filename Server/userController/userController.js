const dbConfig = require("../dbConnection/dbConfig");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");

// Load environment variables securely
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const PASSWORD_MIN_LENGTH = parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// ==========================================
// 1. USER CONTROLLERS
// ==========================================

const userRegister = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!username || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: "Please provide all required information" });
  }

  try {
    const [existingUsers] = await dbConfig.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: "User already registered" });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ msg: `The password must be at least ${PASSWORD_MIN_LENGTH} characters` });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await dbConfig.query(
      "INSERT INTO users(username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstName, lastName, email, hashedPassword]
    );

    return res.status(201).json({ msg: "Successfully registered" });
  } catch (error) {
    console.log("Registration Error:", error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  try {
    const [rows] = await dbConfig.query(
      "SELECT id, username, firstname, lastname, email, password FROM users WHERE email = ?",
      [email]
    );
    
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ msg: "User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = JWT.sign(
      { userid: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({ msg: "Successfully logged in", token });
  } catch (error) {
    console.log("Login Error:", error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

const checkUser = async (req, res) => {
  const { username } = req.user;
  res.status(200).json({ msg: `${username} checked successfully`, username });
};

// ==========================================
// 2. LINKS & DATABASE CONTROLLERS
// ==========================================

const getLinks = async (req, res) => {
  try {
    const [response] = await dbConfig.query("SELECT * FROM links");
    res.status(200).json({ links: response });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const insertLink = async (req, res) => {
  const { img_url, link } = req.body;
  
  if (!img_url || !link) {
    return res.status(400).json({ msg: "img_url and link are required" });
  }

  try {
    const insertInfo = `INSERT INTO links (img_url, Link) VALUES (?, ?)`;
    await dbConfig.query(insertInfo, [img_url, link]);
    res.status(201).json({ msg: "Page updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ==========================================
// 3. PDF CONTROLLERS
// ==========================================

const sendPdf = (req, res, folderName, fileName) => {
  const filePath = path.join(__dirname, "..", folderName, fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.log("We can't find the file:", err.message);
      if (!res.headersSent) res.status(404).send("File not found");
    }
  });
};

const getPharmacologyPdf = (req, res) => sendPdf(req, res, "Pharmacology/Pharmacology pdf", "Pharmacology.pdf");
const getPharmacotherapyPdf = (req, res) => sendPdf(req, res, "Pharmacotherapy", "Therapy-1 &2 merged.pdf");
const getMedChemPdf = (req, res) => sendPdf(req, res, "Med_Chem", "Med_Chem 1&2.pdf");
const getPharmacognosyPdf = (req, res) => sendPdf(req, res, "Pharmacognosy", "Cognosy.pdf");
const getPharmaceuticsPdf = (req, res) => sendPdf(req, res, "Pharmaceutics", "pharmaceutics.pdf");
const getPharmacoAnalysisPdf = (req, res) => sendPdf(req, res, "Pharmaco-analaysis", "Pharmaceutical-anal.pdf");

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // User
  userRegister,
  userLogin,
  checkUser,
  // Links
  getLinks,
  insertLink,
  // PDFs
  getPharmacologyPdf,
  getPharmacotherapyPdf,
  getMedChemPdf,
  getPharmacognosyPdf,
  getPharmaceuticsPdf,
  getPharmacoAnalysisPdf
};