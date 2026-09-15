import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown } from 'lucide-react';
import API from '../services/api';
import CarGrid from './CarGrid';
import FilterSidebar from './FilterSidebar';

const CarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    bodyType: searchParams.get('bodyType') || '',
    seatingCapacity: searchParams.get('seatingCapacity') || '',
    minSafetyRating: searchParams.get('minSafetyRating') || '',
    sort: 'popularity',
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) query.append(key, filters[key]);
      });
      const res = await API.get(`/cars?${query.toString()}`);
      setCars(res.data.cars || []);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      bodyType: '',
      seatingCapacity: '',
      minSafetyRating: '',
      sort: 'popularity',
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900">Car Catalog & Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and filter through {cars.length} verified vehicles with Smart Scores
          </p>
        </div>

        {/* Sorting Controls & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm"
          >
            <Filter className="w-4 h-4 text-blue-600" /> Filters
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="mileage">Best Mileage</option>
              <option value="rating">Highest Safety Rating</option>
              <option value="newest">Newest Arrival</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            mobileOpen={mobileFilterOpen}
            setMobileOpen={setMobileFilterOpen}
          />
        </div>

        {/* Cars Grid Area */}
        <div className="lg:col-span-3">
          <CarGrid cars={cars} loading={loading} />
        </div>

      </div>
    </div>
  );
};

export default CarsPage;
