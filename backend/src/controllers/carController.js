const Car = require('../models/Car');
const calculateSmartScore = require('../utils/smartScore');

// @desc    Get all cars with search, filters, sorting
// @route   GET /api/cars
exports.getCars = async (req, res) => {
  try {
    const {
      search,
      brand,
      model,
      minPrice,
      maxPrice,
      fuelType,
      transmission,
      bodyType,
      minMileage,
      seatingCapacity,
      minSafetyRating,
      year,
      location,
      sort,
      limit,
    } = req.query;

    const query = {};

    // Only fetch non-pending listings or standard database cars
    query.isListing = { $ne: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { bodyType: { $regex: search, $options: 'i' } },
      ];
    }

    if (brand) query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    if (model) query.model = { $regex: new RegExp(model, 'i') };
    if (fuelType) query.fuelType = { $regex: new RegExp(fuelType, 'i') };
    if (transmission) query.transmission = { $regex: new RegExp(transmission, 'i') };
    if (bodyType) query.bodyType = { $regex: new RegExp(bodyType, 'i') };
    if (location) query.location = { $regex: new RegExp(location, 'i') };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minMileage) query.mileage = { $gte: Number(minMileage) };
    if (seatingCapacity) query.seatingCapacity = { $gte: Number(seatingCapacity) };
    if (minSafetyRating) query.safetyRating = { $gte: Number(minSafetyRating) };
    if (year) query.year = Number(year);

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'mileage') sortOptions = { mileage: -1 };
    else if (sort === 'newest') sortOptions = { year: -1, createdAt: -1 };
    else if (sort === 'popularity') sortOptions = { viewsCount: -1 };
    else if (sort === 'rating') sortOptions = { safetyRating: -1 };

    let cars = await Car.find(query).sort(sortOptions).limit(Number(limit) || 100);

    // Attach dynamic Smart Score calculation
    const enhancedCars = cars.map((car) => {
      const carObj = car.toObject();
      carObj.smartScoreInfo = calculateSmartScore(carObj);
      carObj.smartScore = carObj.smartScoreInfo.overall;
      return carObj;
    });

    res.json({
      success: true,
      count: enhancedCars.length,
      cars: enhancedCars,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get curated homepage car categories
// @route   GET /api/cars/categories
exports.getCarCategories = async (req, res) => {
  try {
    const allCars = await Car.find({ isListing: { $ne: true } });

    const enhance = (list) =>
      list.map((c) => {
        const obj = c.toObject();
        obj.smartScoreInfo = calculateSmartScore(obj);
        obj.smartScore = obj.smartScoreInfo.overall;
        return obj;
      });

    const under10Lakh = enhance(allCars.filter((c) => c.price <= 1000000).slice(0, 6));
    const familyCars = enhance(allCars.filter((c) => c.seatingCapacity >= 5).slice(0, 6));
    const bestMileage = enhance(allCars.sort((a, b) => b.mileage - a.mileage).slice(0, 6));
    const bestSafety = enhance(allCars.filter((c) => c.safetyRating >= 4).slice(0, 6));

    res.json({
      under10Lakh,
      familyCars,
      bestMileage,
      bestSafety,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Increment view count
    car.viewsCount += 1;
    await car.save();

    const carObj = car.toObject();
    carObj.smartScoreInfo = calculateSmartScore(carObj);
    carObj.smartScore = carObj.smartScoreInfo.overall;

    res.json(carObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new car (Admin/Seller)
// @route   POST /api/cars
exports.createCar = async (req, res) => {
  try {
    const car = new Car({
      ...req.body,
      seller: req.user._id,
    });
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update car (Admin/Seller)
// @route   PUT /api/cars/:id
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    if (req.user.role !== 'admin' && car.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this car' });
    }

    Object.assign(car, req.body);
    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete car (Admin/Seller)
// @route   DELETE /api/cars/:id
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    if (req.user.role !== 'admin' && car.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this car' });
    }

    await car.deleteOne();
    res.json({ message: 'Car removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
