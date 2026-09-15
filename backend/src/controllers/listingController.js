const Listing = require('../models/Listing');
const Car = require('../models/Car');
const Notification = require('../models/Notification');

// @desc    Create sell car listing (Pending Admin Approval)
// @route   POST /api/listings
exports.createListing = async (req, res) => {
  try {
    const {
      brand,
      model,
      variant,
      year,
      kmDriven,
      fuelType,
      transmission,
      bodyType,
      condition,
      expectedPrice,
      description,
      location,
      images,
    } = req.body;

    // First create Car record flagged as user listing
    const car = await Car.create({
      name: `${year} ${brand} ${model} ${variant || ''}`.trim(),
      brand,
      model,
      variant: variant || 'Standard',
      year: Number(year),
      price: Number(expectedPrice),
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Manual',
      bodyType: bodyType || 'Hatchback',
      mileage: 18,
      engine: '1.2L Engine',
      horsepower: 85,
      torque: 113,
      seatingCapacity: 5,
      description: description || '',
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'],
      location: location || 'India',
      seller: req.user._id,
      isListing: true,
    });

    const listing = await Listing.create({
      car: car._id,
      seller: req.user._id,
      expectedPrice: Number(expectedPrice),
      kmDriven: Number(kmDriven),
      condition: condition || 'Good',
      status: 'pending',
    });

    // Send confirmation notification to seller
    await Notification.create({
      user: req.user._id,
      title: 'Listing Submitted',
      message: `Your listing for ${car.name} has been submitted for admin approval.`,
      type: 'listing',
    });

    res.status(201).json({
      message: 'Listing submitted successfully. Awaiting admin approval.',
      listing,
      car,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's seller listings
// @route   GET /api/listings/my-listings
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public approved listings
// @route   GET /api/listings
exports.getApprovedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'approved' })
      .populate('car')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing status (Admin approval or Seller Mark Sold)
// @route   PUT /api/listings/:id/status
exports.updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved', 'rejected', 'sold'
    const listing = await Listing.findById(req.params.id).populate('car');

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Admin can approve/reject. Seller can mark as 'sold'
    const isOwner = listing.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    listing.status = status;
    await listing.save();

    // If approved by admin, make car visible in main searches if desired
    if (status === 'approved' && listing.car) {
      listing.car.isListing = false; // Make searchable in public cars
      await listing.car.save();

      await Notification.create({
        user: listing.seller,
        title: 'Listing Approved! 🎉',
        message: `Your listing for ${listing.car.name} is now live!`,
        type: 'listing',
      });
    } else if (status === 'sold') {
      await Notification.create({
        user: listing.seller,
        title: 'Car Marked as Sold! 🚗',
        message: `Congratulations! Your vehicle ${listing.car.name} was marked as sold.`,
        type: 'listing',
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete seller listing
// @route   DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const isOwner = listing.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    if (listing.car) {
      await Car.findByIdAndDelete(listing.car);
    }
    await listing.deleteOne();

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
