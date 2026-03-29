import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("Auth middleware hit"); // Debug log
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
  const err = new Error("No token provided");
  err.statusCode = 401; // ✅ correct
  return next(err);     // ❗ don't throw
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Auth middleware error:", err); // Debug log
   err.message="Session expired. Please log in again.";
    next(err); 
  }
};

export default authMiddleware;