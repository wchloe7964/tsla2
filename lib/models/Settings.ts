import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  platformName: { type: String, default: 'TSLA' },
  maintenanceMode: { type: Boolean, default: false },
  allowNewRegistrations: { type: Boolean, default: true },
  withdrawalEnabled: { type: Boolean, default: true },
  minWithdrawalAmount: { type: Number, default: 10 },
  withdrawalFeePercent: { type: Number, default: 2.5 }, // New Field
  referralBonusPercent: { type: Number, default: 5 },
  systemNotice: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)