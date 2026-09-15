import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Shield, Heart, GitCompare, ArrowRight, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import SmartScoreBadge from './SmartScoreBadge';

const CarCard = ({ car }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  if (!car) return null;

  const inWishlist = isInWishlist(car._id);
  const inCompare = isInCompare(car._id);

  const priceInLakhs = car.price >= 100000 ? (car.price / 100000).toFixed(2) + ' Lakh' : '₹' + car.price.toLocaleString();
  const estimatedEMI = Math.round((car.price * 0.8 * (8.5 / 12 / 100) * Math.pow(1 + 8.5 / 12 / 100, 60)) / (Math.pow(1 + 8.5 / 12 / 100, 60) - 1));

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(car._id);
    } else {
      addToCompare(car);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(car._id);
  };

  const fallbackImg = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop';
  const carImage = car.images && car.images.length > 0 && car.images[0] ? car.images[0] : fallbackImg;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full relative border border-slate-200 bg-white">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={carImage}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = fallbackImg; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
            {car.brand}
          </span>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                inWishlist ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Floating Smart Score */}
        <div className="absolute bottom-3 left-3">
          <SmartScoreBadge score={car.smartScore || car.smartScoreInfo?.overall || 82} scoreInfo={car.smartScoreInfo} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {car.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">{car.year} • {car.variant || 'Base'} • {car.bodyType}</p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 mb-3 text-[11px] text-slate-700">
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <Fuel className="w-3.5 h-3.5 text-blue-600 mb-1" />
              <span className="font-bold">{car.fuelType}</span>
              <span className="text-[10px] text-slate-400">{car.mileage ? `${car.mileage} kmpl` : 'N/A'}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <Gauge className="w-3.5 h-3.5 text-indigo-600 mb-1" />
              <span className="font-bold">{car.transmission}</span>
              <span className="text-[10px] text-slate-400">{car.horsepower || 100} bhp</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <Shield className="w-3.5 h-3.5 text-emerald-600 mb-1" />
              <span className="font-bold text-emerald-600">{car.safetyRating || 4} Stars</span>
              <span className="text-[10px] text-slate-400">{car.airbags || 2} Airbags</span>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ex-Showroom Price</span>
              <span className="font-heading font-extrabold text-lg text-slate-900">₹{priceInLakhs}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">EMI Starts</span>
              <span className="text-xs font-bold text-blue-600">₹{estimatedEMI.toLocaleString()}/mo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Compare Toggle Button */}
            <button
              onClick={handleCompareClick}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                inCompare
                  ? 'bg-blue-50 text-blue-600 border-blue-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {inCompare ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <GitCompare className="w-3.5 h-3.5" />}
              {inCompare ? 'Added' : 'Compare'}
            </button>

            {/* View Details Link */}
            <Link
              to={`/cars/${car._id}`}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 transition-all shadow-md shadow-blue-600/20"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarCard;
