import React from 'react';
import { Filter, X, RotateCcw, Search } from 'lucide-react';

const BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Mahindra',
  'Toyota',
  'Honda',
  'Skoda',
  'Volkswagen',
  'Kia',
  'MG',
  'Renault',
  'Nissan',
  'Jeep',
  'BMW',
  'Mercedes-Benz',
  'Audi',
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'DCT', 'AMT'];
const BODY_TYPES = ['SUV', 'Sedan', 'Hatchback', 'MUV', 'EV'];

const FilterSidebar = ({ filters, onChange, onReset, mobileOpen, setMobileOpen }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const content = (
    <div className="space-y-6 text-xs text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Vehicles
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Search Keywords</label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search brand, model..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
      </div>

      {/* Brand Selection */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Brand / Make</label>
        <select
          value={filters.brand || ''}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
        >
          <option value="">All Brands (16+)</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Budget Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700">Max Budget</label>
          <span className="text-xs font-extrabold text-blue-600">
            {filters.maxPrice ? `₹${(filters.maxPrice / 100000).toFixed(1)} Lakh` : 'Any Budget'}
          </span>
        </div>
        <input
          type="range"
          min="500000"
          max="7000000"
          step="200000"
          value={filters.maxPrice || 7000000}
          onChange={(e) => handleChange('maxPrice', e.target.value === '7000000' ? '' : e.target.value)}
          className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>₹5 Lakh</span>
          <span>₹30 Lakh</span>
          <span>₹70 Lakh+</span>
        </div>
      </div>

      {/* Body Type Pills */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Body Style</label>
        <div className="flex flex-wrap gap-1.5">
          {BODY_TYPES.map((bt) => {
            const active = filters.bodyType === bt;
            return (
              <button
                key={bt}
                type="button"
                onClick={() => handleChange('bodyType', active ? '' : bt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Type Pills */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Fuel Type</label>
        <div className="flex flex-wrap gap-1.5">
          {FUEL_TYPES.map((ft) => {
            const active = filters.fuelType === ft;
            return (
              <button
                key={ft}
                type="button"
                onClick={() => handleChange('fuelType', active ? '' : ft)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ft}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Transmission</label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => handleChange('transmission', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
        >
          <option value="">Any Transmission</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Seating Capacity & Safety Rating */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Min Seating</label>
          <select
            value={filters.seatingCapacity || ''}
            onChange={(e) => handleChange('seatingCapacity', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="">Any</option>
            <option value="5">5+ Seats</option>
            <option value="6">6+ Seats</option>
            <option value="7">7+ Seats</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Min Safety Stars</label>
          <select
            value={filters.minSafetyRating || ''}
            onChange={(e) => handleChange('minSafetyRating', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="">Any Stars</option>
            <option value="4">4 Stars & Up</option>
            <option value="5">5 Stars Only</option>
          </select>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-20">
        {content}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-white border-l border-slate-200 h-full p-6 overflow-y-auto z-10 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
