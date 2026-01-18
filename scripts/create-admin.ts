import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// Minimal Schema for the script to work without importing the whole model file
const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: "user" },
  kycLevel: { type: String, default: "LEVEL_1" },
  wallet: { balance: Number, currency: String },
});

const User = mongoose.models.User || mongoose.model("User", AdminSchema);

async function createAdmin() {
  const adminEmail = "manager@tesla.com"; // CHANGE THIS
  const adminPassword = "KSZ4DbTM$kI&AtxK"; // CHANGE THIS
  const adminName = "Tesla Grok";

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected.");

    // Check if user exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log("⚠️ User already exists. Updating role to admin...");
      existingUser.role = "admin";
      await existingUser.save();
      console.log("✅ Role updated successfully.");
    } else {
      console.log("⏳ Creating new Admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        kycLevel: "LEVEL_2", // Admins are auto-verified
        wallet: { balance: 0, currency: "USD" },
      });
      console.log("✅ Admin created successfully!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createAdmin();
