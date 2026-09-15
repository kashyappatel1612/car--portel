const Review = require('../models/Review');

// @desc    Get reviews for a car
// @route   GET /api/reviews/car/:carId
exports.getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;

    res.json({
      total,
      avgRating: Number(avgRating),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's written reviews
// @route   GET /api/reviews/my-reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review for a car
// @route   POST /api/reviews/car/:carId
exports.addReview = async (req, res) => {
  try {
    const { carId } = req.params;
    const { rating, title, comment, ownershipDuration } = req.body;

    const existing = await Review.findOne({ car: carId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a review for this car.' });
    }

    const review = await Review.create({
      car: carId,
      user: req.user._id,
      rating: Number(rating),
      title,
      comment,
      ownershipDuration: ownershipDuration || '1 year',
    });

    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
