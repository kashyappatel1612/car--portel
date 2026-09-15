const express = require('express');
const router = express.Router();
const {
  createListing,
  getMyListings,
  getApprovedListings,
  updateListingStatus,
  deleteListing,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

router.get('/', getApprovedListings);
router.get('/my-listings', protect, getMyListings);
router.post('/', protect, createListing);
router.put('/:id/status', protect, updateListingStatus);
router.delete('/:id', protect, deleteListing);

module.exports = router;
