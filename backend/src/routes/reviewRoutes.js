const express = require('express');
const router = express.Router();
const { getCarReviews, getMyReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/car/:carId', getCarReviews);
router.get('/my-reviews', protect, getMyReviews);
router.post('/car/:carId', protect, addReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
