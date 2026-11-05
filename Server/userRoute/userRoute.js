const express=require("express");
const route=express.Router();
const authMiddleWare = require("../authMiddleWare/authMiddleWare");




// Import everything from the controller
const {
  getLinks,
  insertLink,
  getPharmacologyPdf,
  getPharmacotherapyPdf,
  getMedChemPdf,
  getPharmacognosyPdf,
  getPharmaceuticsPdf,
  getPharmacoAnalysisPdf,
  userRegister,
  userLogin,
  checkUser
} = require("../userController/userController");


// Database Routes
route.get("/create", getLinks);
route.post("/insert", insertLink);
route.post("/register",userRegister);
route.post("/login",userLogin);
route.get("/check",authMiddleWare,checkUser);

// PDF Routes
route.get("/Pharmacology-pdf",authMiddleWare, getPharmacologyPdf);
route.get("/Pharmacotherapy-pdf",authMiddleWare, getPharmacotherapyPdf);
route.get("/Medicinal_Chemistry-pdf",authMiddleWare, getMedChemPdf);
route.get("/Pharmacognosy-pdf",authMiddleWare, getPharmacognosyPdf);
route.get("/Pharmaceutics-pdf",authMiddleWare, getPharmaceuticsPdf);
route.get("/Pharmaco-Analysis-pdf",authMiddleWare, getPharmacoAnalysisPdf);

module.exports = route;