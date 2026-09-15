const Dealer = require('../models/Dealer');

// @desc    Get all dealers with city/brand filter
// @route   GET /api/dealers
exports.getDealers = async (req, res) => {
  try {
    const { city, brand } = req.query;
    const query = {};

    if (city) query.city = { $regex: new RegExp(city, 'i') };
    if (brand) query.brandsHandled = { $in: [new RegExp(brand, 'i')] };

    const dealers = await Dealer.find(query).sort({ rating: -1 });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dealer by ID
// @route   GET /api/dealers/:id
exports.getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });
    res.json(dealer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
