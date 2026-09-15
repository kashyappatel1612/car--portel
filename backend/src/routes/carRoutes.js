const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarCategories,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCars);
router.get('/categories', getCarCategories);
router.get('/:id', getCarById);

router.post('/', protect, authorize('admin', 'seller'), createCar);
router.put('/:id', protect, authorize('admin', 'seller'), updateCar);
router.delete('/:id', protect, authorize('admin', 'seller'), deleteCar);

module.exports = router;
