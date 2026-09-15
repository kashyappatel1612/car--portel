const express = require('express');
const router = express.Router();
const { getCarPriceHistory } = require('../controllers/priceHistoryController');

router.get('/car/:carId', getCarPriceHistory);

module.exports = router;
