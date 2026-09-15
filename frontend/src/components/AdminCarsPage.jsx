import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Edit } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const AdminCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await API.get('/cars');
      setCars(res.data.cars || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car from database?')) return;
    try {
      await API.delete(`/cars/${id}`);
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting car');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2">
            <Car className="w-7 h-7 text-purple-600" />
            Manage Database Vehicles ({cars.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Full database CRUD for ex-showroom car telemetry & specs</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching vehicle catalog..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-4">Car Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">Fuel & Transmission</th>
                <th className="p-4">Safety</th>
                <th className="p-4">Smart Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {cars.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img
                      src={c.images && c.images[0] ? c.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'}
                      alt={c.name}
                      className="w-10 h-8 object-cover rounded-lg border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div>{c.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{c.variant} ({c.year})</span>
                    </div>
                  </td>
                  <td className="p-4 text-blue-600 font-semibold">{c.brand}</td>
                  <td className="p-4 font-bold text-slate-900">₹{(c.price / 100000).toFixed(2)}L</td>
                  <td className="p-4">{c.fuelType} • {c.transmission}</td>
                  <td className="p-4 text-emerald-600 font-bold">{c.safetyRating} Stars</td>
                  <td className="p-4 text-blue-600 font-extrabold">{c.smartScore || 85}/100</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Car"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminCarsPage;

