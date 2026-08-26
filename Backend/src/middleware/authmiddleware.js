import jwt from "jsonwebtoken";

export default function authMiddleware(roles) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!roles.includes(decoded?.role)) {
        return res.status(401).json({ message: "Access Denied" });
      }
      next();
    } catch (e) {
      console.log("\n\n\n==================\n");
      console.error(e);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
}
