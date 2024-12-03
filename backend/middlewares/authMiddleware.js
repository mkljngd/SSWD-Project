const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  console.log("AuthMiddleware invoked"); // Debugging

  const authHeader = req.header("Authorization");
  console.log("HEADER", authHeader);

  if (!authHeader) {
    console.log("No Authorization header provided");
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1];
  
  if (token === process.env.JWT_SECRET) {
    console.log("Using JWT_SECRET as Authorization token"); // Debugging
    req.user = { role: "admin" }; // You can set a default role or other information here
    return next();
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Invalid or Expired Token");
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;