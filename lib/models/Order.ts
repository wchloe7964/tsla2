import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  color: String,
  configuration: mongoose.Schema.Types.Mixed,
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  estimatedDelivery: Date
}, {
  timestamps: true
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)