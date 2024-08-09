const jwt = require("jsonwebtoken");
const User = require("../model/User-Schema");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(`Extracted Token: ${token}`);

  if (!token) {
    return res.status(401).send("Access denied: No token provided");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`Decoded Token: ${JSON.stringify(decoded)}`);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).send("Access denied: User not found");
    }
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).send("Access denied: Invalid token");
  }
};

module.exports = { authenticateToken };
