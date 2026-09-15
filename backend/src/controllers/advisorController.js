const Car = require('../models/Car');
const { generateRecommendations } = require('../services/aiAdvisor');

// @desc    Generate AI Car Recommendations
// @route   POST /api/advisor/recommend
exports.recommendCars = async (req, res) => {
  try {
    const answers = req.body;
    const allCars = await Car.find({ isListing: { $ne: true } });

    const result = await generateRecommendations(answers, allCars);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
