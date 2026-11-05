const JWT = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
        return res.status(500).json({ msg: "Internal server error" });
    }

    try {
        const token = authHeader.slice(7).trim();
        
        // No 'await' needed here either!
        const decoded = JWT.verify(token, secret);
        
        req.user = { userid: decoded.userid, username: decoded.username };
        
        return next();

    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
};

module.exports = authMiddleWare;