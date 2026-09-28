import jwt from "jsonwebtoken";

function getJwtSecret() {
  return process.env.JWT_SECRET || "hostelfix_default_jwt_secret_key_change_in_production";
}

export function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    req.user = jwt.verify(header.split(" ")[1], getJwtSecret());
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
