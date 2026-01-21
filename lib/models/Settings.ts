import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "admin_config",
    },
    walletAddress: { type: String, required: true },
    network: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
