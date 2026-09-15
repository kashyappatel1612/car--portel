const express = require('express');
const router = express.Router();
const { getEMI, getOwnershipCost, getUsedCarValuation } = require('../controllers/calculatorController');

router.post('/emi', getEMI);
router.post('/ownership', getOwnershipCost);
router.post('/used-car-valuation', getUsedCarValuation);

module.exports = router;
