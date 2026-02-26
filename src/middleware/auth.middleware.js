const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    // Expecting: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { user_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
