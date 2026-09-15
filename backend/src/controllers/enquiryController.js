const Enquiry = require('../models/Enquiry');
const Notification = require('../models/Notification');
const Car = require('../models/Car');

// @desc    Create enquiry for a car
// @route   POST /api/enquiries
exports.createEnquiry = async (req, res) => {
  try {
    const { carId, message, phone } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Determine seller (or fallback to admin if car has no seller)
    const sellerId = car.seller || req.user._id;

    const enquiry = await Enquiry.create({
      car: carId,
      buyer: req.user._id,
      seller: sellerId,
      message,
      phone: phone || req.user.phone || '',
      status: 'new',
    });

    // Send notification to seller
    if (car.seller) {
      await Notification.create({
        user: car.seller,
        title: 'New Car Enquiry! 📩',
        message: `${req.user.name} sent an enquiry for your ${car.name}.`,
        type: 'enquiry',
      });
    }

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's enquiries (both sent as buyer & received as seller)
// @route   GET /api/enquiries/my-enquiries
exports.getMyEnquiries = async (req, res) => {
  try {
    const userId = req.user._id;

    const sentEnquiries = await Enquiry.find({ buyer: userId })
      .populate('car')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    const receivedEnquiries = await Enquiry.find({ seller: userId })
      .populate('car')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      sent: sentEnquiries,
      received: receivedEnquiries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'new', 'contacted', 'closed'
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    enquiry.status = status;
    await enquiry.save();

    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
