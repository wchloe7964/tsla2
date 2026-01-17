import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  device: { type: String },
  ip: { type: String },
  location: { type: String, default: 'Unknown' }, // New field
  lastActive: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);