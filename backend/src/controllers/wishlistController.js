const Wishlist = require('../models/Wishlist');
const calculateSmartScore = require('../utils/smartScore');

// @desc    Get user wishlist
// @route   GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    const cars = items
      .filter((item) => item.car !== null)
      .map((item) => {
        const carObj = item.car.toObject();
        carObj.smartScoreInfo = calculateSmartScore(carObj);
        carObj.smartScore = carObj.smartScoreInfo.overall;
        return {
          _id: item._id,
          car: carObj,
          createdAt: item.createdAt,
        };
      });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add car to wishlist
// @route   POST /api/wishlist/:carId
exports.addToWishlist = async (req, res) => {
  try {
    const { carId } = req.params;
    const existing = await Wishlist.findOne({ user: req.user._id, car: carId });

    if (existing) {
      return res.status(400).json({ message: 'Car is already in your wishlist' });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      car: carId,
    });

    res.status(201).json({ message: 'Car added to wishlist', item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove car from wishlist
// @route   DELETE /api/wishlist/:carId
exports.removeFromWishlist = async (req, res) => {
  try {
    const { carId } = req.params;
    await Wishlist.findOneAndDelete({ user: req.user._id, car: carId });
    res.json({ message: 'Car removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
