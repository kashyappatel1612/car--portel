const Order = require('../models/Order');
const Listing = require('../models/Listing');
const Car = require('../models/Car');
const Notification = require('../models/Notification');

// @desc    Create Buy Car / Booking / Test Drive Request
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      carId,
      listingId,
      type,
      bookingAmount,
      preferredDate,
      paymentMethod,
      buyerContact,
      notes,
    } = req.body;

    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    let actualListing = null;
    let targetListingId = listingId;

    if (targetListingId) {
      actualListing = await Listing.findById(targetListingId);
    } else {
      // Check if this car is associated with an active listing
      actualListing = await Listing.findOne({ car: carId, status: { $in: ['approved', 'reserved'] } });
      if (actualListing) {
        targetListingId = actualListing._id;
      }
    }

    if (actualListing && ['sold'].includes(actualListing.status)) {
      return res.status(400).json({ message: 'This car is already marked as sold.' });
    }

    if (actualListing && actualListing.status === 'reserved' && type !== 'test_drive') {
      return res.status(400).json({ message: 'This vehicle is already reserved by another buyer.' });
    }

    // Determine seller: car's seller or listing seller or fallback to req.user._id
    const sellerId = (actualListing && actualListing.seller) || car.seller || req.user._id;

    if (sellerId.toString() === req.user._id.toString() && actualListing) {
      return res.status(400).json({ message: 'You cannot place a purchase order on your own listing.' });
    }

    const requestedType = type || 'booking';
    const amountToCharge = requestedType === 'test_drive' ? 0 : Number(bookingAmount || 10000);

    const order = await Order.create({
      car: car._id,
      listing: targetListingId || null,
      buyer: req.user._id,
      seller: sellerId,
      type: requestedType,
      bookingAmount: amountToCharge,
      totalAmount: car.price,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus:
        ['cash_on_delivery', 'offline_dealership'].includes(paymentMethod) || requestedType === 'test_drive'
          ? 'pending'
          : 'paid',
      orderStatus: 'requested',
      buyerContact: {
        fullName: buyerContact?.fullName || req.user.name,
        phone: buyerContact?.phone || req.user.phone || '',
        email: buyerContact?.email || req.user.email,
        city: buyerContact?.city || car.location || '',
        deliveryAddress: buyerContact?.deliveryAddress || '',
      },
      notes: notes || '',
    });

    // If it's a reservation or direct purchase on a listing, hold it as 'reserved'
    if (actualListing && (requestedType === 'booking' || requestedType === 'direct_purchase')) {
      actualListing.status = 'reserved';
      await actualListing.save();
    }

    // Send notification to Seller
    if (sellerId && sellerId.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: sellerId,
        title: 'New Car Purchase Request! 🚗',
        message: `${order.buyerContact.fullName} submitted a ${requestedType.replace('_', ' ')} request for ${car.name}.`,
        type: 'order',
      });
    }

    // Confirmation notification to Buyer
    await Notification.create({
      user: req.user._id,
      title: 'Order Placed Successfully ✅',
      message: `Your booking (${order.orderNumber}) for ${car.name} has been placed.`,
      type: 'order',
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's purchases / orders as Buyer
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('car')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders received as Seller
// @route   GET /api/orders/received
exports.getReceivedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('car')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('car')
      .populate('seller', 'name email phone')
      .populate('buyer', 'name email phone');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.seller._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('car')
      .populate('listing');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isSeller = order.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to modify this order' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;

      // Sync listing state if attached
      if (order.listing) {
        if (orderStatus === 'completed') {
          order.listing.status = 'sold';
          await order.listing.save();
        } else if (orderStatus === 'cancelled') {
          // Release car back to available
          order.listing.status = 'approved';
          await order.listing.save();
        }
      }

      // Notify Buyer
      await Notification.create({
        user: order.buyer,
        title: `Order Status: ${orderStatus.toUpperCase()}`,
        message: `Your booking for ${order.car?.name || 'car'} has been updated to "${orderStatus}".`,
        type: 'order',
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
