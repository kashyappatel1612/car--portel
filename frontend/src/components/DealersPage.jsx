import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Star } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const DealersPage = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      try {
        const query = selectedCity ? `?city=${selectedCity}` : '';
        const res = await API.get(`/dealers${query}`);
        setDealers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch dealers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, [selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2.5">
            <Store className="w-7 h-7 text-blue-600" />
            Verified Dealer Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Locate authorized dealer showrooms across India for test drives & physical inspection
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
          >
            <option value="">All Cities</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Gurugram">Gurugram</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Locating dealer showrooms..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.map((d) => (
            <div key={d._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                    {d.city}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {d.rating}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900">{d.name}</h3>

                <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed font-medium">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  {d.address}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {d.brandsHandled?.map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Inventory</span>
                  <span className="font-extrabold text-emerald-600">{d.carsAvailable} Cars Available</span>
                </div>

                <a
                  href={`tel:${d.phone}`}
                  className="px-3.5 py-1.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Showroom
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DealersPage;
