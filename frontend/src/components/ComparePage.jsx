import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, Search, Trash2, X } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import CompareTable from './CompareTable';
import API from '../services/api';

const ComparePage = () => {
  const { selectedCars, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [allCars, setAllCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        const res = await API.get('/cars');
        setAllCars(res.data.cars || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllCars();
  }, []);

  const filteredCars = allCars.filter(
    (c) =>
      !selectedCars.some((sc) => sc._id === c._id) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2.5">
            <GitCompare className="w-7 h-7 text-blue-600" />
            Side-by-Side Car Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare 2 to 4 vehicles dynamically across 16+ telemetry attributes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCars.length < 4 && (
            <button
              onClick={() => setSearchModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" /> Add Car to Compare ({selectedCars.length}/4)
            </button>
          )}

          {selectedCars.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 flex items-center gap-1 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid or Selection Prompt */}
      {selectedCars.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center max-w-lg mx-auto border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
            <GitCompare className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">No Cars Selected for Comparison</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select 2 to 4 vehicles from the catalog or click below to compare prices, fuel mileage, safety stars, horsepower, and Smart Scores.
          </p>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Pick Vehicles to Compare
          </button>
        </div>
      ) : (
        <CompareTable cars={selectedCars} onRemove={removeFromCompare} />
      )}

      {/* Car Selector Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-slate-900">Select Vehicle to Compare</h3>
              <button onClick={() => setSearchModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Swift, Nexon, Creta, BMW..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-100">
              {filteredCars.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    addToCompare(c);
                    setSearchModalOpen(false);
                  }}
                  className="p-3 rounded-2xl hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.images && c.images[0] ? c.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'}
                      alt={c.name}
                      className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                      <p className="text-[11px] text-slate-500">{c.fuelType} • {c.transmission} • ₹{(c.price / 100000).toFixed(2)}L</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]">Add +</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ComparePage;
