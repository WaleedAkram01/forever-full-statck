import jwt from "jsonwebtoken";

// Verifies the admin token. Two roles exist:
// - "admin": full access
// - "demo":  read-only access (for portfolio visitors), blocked from any write route
const adminAuth = (options = {}) => {
  const { allowDemo = false } = options;

  return (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || (decoded.role !== "admin" && decoded.role !== "demo")) {
        return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
      }

      if (decoded.role === "demo" && !allowDemo) {
        return res.status(403).json({
          success: false,
          message: "Demo mode is read-only. Changes are disabled for the demo account.",
        });
      }

      req.adminRole = decoded.role;
      next();
    } catch {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
  };
};

export default adminAuth;
