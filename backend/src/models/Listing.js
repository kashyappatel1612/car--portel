const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expectedPrice: { type: Number, required: true },
    kmDriven: { type: Number, required: true },
    condition: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Needs Work'], default: 'Good' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold'],
      default: 'pending',
    },
    viewsCount: { type: Number, default: 0 },
    enquiriesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
