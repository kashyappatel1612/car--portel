const express = require('express');
const router = express.Router();
const { recommendCars } = require('../controllers/advisorController');

router.post('/recommend', recommendCars);

module.exports = router;
