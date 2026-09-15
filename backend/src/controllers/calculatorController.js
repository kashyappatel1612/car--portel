const {
  calculateEMI,
  calculateOwnershipCost,
  calculateFairPrice,
} = require('../utils/calculators');

// @desc    Calculate EMI
// @route   POST /api/calculator/emi
exports.getEMI = async (req, res) => {
  try {
    const result = calculateEMI(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Calculate Total Ownership Cost
// @route   POST /api/calculator/ownership
exports.getOwnershipCost = async (req, res) => {
  try {
    const result = calculateOwnershipCost(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Calculate Used Car Fair Market Valuation
// @route   POST /api/calculator/used-car-valuation
exports.getUsedCarValuation = async (req, res) => {
  try {
    const result = calculateFairPrice(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
