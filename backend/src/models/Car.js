const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, default: 'Base' },
    year: { type: Number, required: true },
    price: { type: Number, required: true }, // In INR (Lakhs or full amount)
    fuelType: {
      type: String,
      required: true,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    },
    transmission: {
      type: String,
      required: true,
      enum: ['Manual', 'Automatic', 'CVT', 'DCT', 'AMT'],
    },
    bodyType: {
      type: String,
      required: true,
      enum: ['SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe', 'Convertible', 'EV'],
    },
    mileage: { type: Number, required: true }, // kmpl or km/kWh
    engine: { type: String, required: true }, // e.g. "1.2L DualJet" or "1197 cc"
    horsepower: { type: Number, required: true }, // bhp
    torque: { type: Number, required: true }, // Nm
    seatingCapacity: { type: Number, required: true },
    bootSpace: { type: Number, default: 300 }, // Liters
    safetyRating: { type: Number, default: 4, min: 0, max: 5 }, // GNCAP stars
    airbags: { type: Number, default: 2 },
    groundClearance: { type: Number, default: 170 }, // mm
    length: { type: Number, default: 3995 }, // mm
    width: { type: Number, default: 1745 }, // mm
    height: { type: Number, default: 1510 }, // mm
    serviceCost: { type: Number, default: 5000 }, // Annual estimated service in INR
    insuranceCost: { type: Number, default: 25000 }, // Annual insurance in INR
    resaleValue: { type: Number, default: 70 }, // % retained after 3 years
    description: { type: String, default: '' },
    features: [{ type: String }],
    pros: [{ type: String }],
    cons: [{ type: String }],
    images: [{ type: String }],
    location: { type: String, default: 'Pan India' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isListing: { type: Boolean, default: false }, // true if user-submitted used car listing
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Car', carSchema);
