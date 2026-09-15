const express = require('express');
const router = express.Router();
const { createEnquiry, getMyEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createEnquiry);
router.get('/my-enquiries', getMyEnquiries);
router.put('/:id/status', updateEnquiryStatus);

module.exports = router;
