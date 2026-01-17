import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    adminName: String,
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetUserName: String,
    action: {
      type: String,
      required: true,
      enum: [
        "KYC_APPROVE",
        "KYC_REJECT",
        "BALANCE_UPDATE",
        "USER_BAN",
        "ROLE_CHANGE",
      ],
    },
    details: {
      reason: String,
      previousStatus: String,
      newStatus: String,
      metadata: mongoose.Schema.Types.Mixed, // For flexible extra data
    },
    ipAddress: String,
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
