const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    carsAvailable: { type: Number, default: 10 },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    image: { type: String, default: '' },
    brandsHandled: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dealer', dealerSchema);
