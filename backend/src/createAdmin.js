import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const ADMIN_NAME = process.env.ADMIN_NAME || "HostelFix Admin";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.name = ADMIN_NAME;
    existing.role = "admin";
    existing.password = hashed;
    await existing.save();
    console.log(`Admin account updated: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin"
    });
    console.log(`Admin account created: ${ADMIN_EMAIL}`);
  }
} catch (err) {
  console.error("Admin creation failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
