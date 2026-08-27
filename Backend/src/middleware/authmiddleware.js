import jwt from "jsonwebtoken";

export default function authMiddleware(roles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token required" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;

      if (Array.isArray(roles) && roles.length > 0) {
        const userRole = decoded?.role;
        // If roles requires specific role(s) and user's role is not included
        if (!userRole || (!roles.includes(userRole) && decoded?.role !== "superadmin")) {
          return res.status(403).json({ message: "Access Denied: Insufficient permissions" });
        }
      }

      next();
    } catch (e) {
      if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired authorization token" });
      }
      console.error("Auth Middleware Error:", e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
      }
    }
  } catch {
    // Optional auth, proceed even if token invalid
  }
  next();
}
