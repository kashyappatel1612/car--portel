const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    ownershipDuration: { type: String, default: '1 year' },
  },
  { timestamps: true }
);

reviewSchema.index({ car: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
