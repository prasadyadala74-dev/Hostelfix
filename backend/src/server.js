import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`HostelFix API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB initial connection failed:", err.message);
    process.exit(1);
  });
