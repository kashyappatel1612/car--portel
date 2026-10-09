const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () =>
        'ORD-' +
        Date.now().toString(36).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 6).toUpperCase(),
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      default: null,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'test_drive', 'direct_purchase'],
      default: 'booking',
    },
    bookingAmount: {
      type: Number,
      default: 10000,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'cash_on_delivery', 'offline_dealership'],
      default: 'upi',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['requested', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    buyerContact: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      city: { type: String, default: '' },
      deliveryAddress: { type: String, default: '' },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
