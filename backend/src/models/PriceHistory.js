const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    pricePoints: [
      {
        date: { type: String, required: true }, // e.g. "Jan 2024" or "2024-01-01"
        price: { type: Number, required: true }, // In Lakhs or INR
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
