import mongoose from 'mongoose'

const KYCRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  docType: { 
    type: String, 
    enum: ['passport', 'id', 'license'], 
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING',
    index: true
  },
  adminNotes: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewedAt: Date,
}, { 
  timestamps: true 
});

export default mongoose.models.KYCRequest || mongoose.model('KYCRequest', KYCRequestSchema);