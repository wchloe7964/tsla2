import mongoose from "mongoose";

const SiteConfigSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Neural Dashboard" },
    siteDescription: { type: String, default: "Advanced Equity Monitoring" },
    contactEmail: String,
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", SiteConfigSchema);
