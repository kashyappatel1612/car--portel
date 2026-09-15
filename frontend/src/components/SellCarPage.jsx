import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Skoda', 'Volkswagen', 'Kia', 'MG', 'BMW', 'Mercedes-Benz'];

const SellCarPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX Manual',
    year: 2022,
    kmDriven: 25000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'SUV',
    condition: 'Good',
    expectedPrice: 1150000,
    description: 'Well-maintained single owner vehicle with complete authorized dealer service records.',
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await API.post('/listings', {
        ...form,
        images: [form.imageUrl],
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit car listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      <div className="text-center space-y-2">
        <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center justify-center gap-2">
          <PlusCircle className="w-7 h-7 text-blue-600" />
          List Your Car for Sale
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Post your vehicle listing directly to thousands of active buyers. Listings undergo admin review before going live.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white p-10 rounded-3xl text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
          <h3 className="font-heading font-bold text-xl text-slate-900">Listing Submitted Successfully!</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your vehicle has been submitted to the admin queue. Once approved, it will be listed publicly on the marketplace.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/my-listings')}
              className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md"
            >
              View My Listings
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 text-xs hover:bg-slate-200"
            >
              Post Another Car
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
          {error && <p className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Brand / Manufacturer</label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Model Name</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Variant / Trim</label>
              <input
                type="text"
                value={form.variant}
                onChange={(e) => setForm({ ...form, variant: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Registration Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Kilometers Driven</label>
              <input
                type="number"
                value={form.kmDriven}
                onChange={(e) => setForm({ ...form, kmDriven: Number(e.target.value) })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Expected Price (₹)</label>
              <input
                type="number"
                value={form.expectedPrice}
                onChange={(e) => setForm({ ...form, expectedPrice: Number(e.target.value) })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Work">Needs Work</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Location City</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Image URL (Web Image Link)</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all text-xs shadow-md shadow-blue-600/20"
            >
              {loading ? 'Submitting...' : 'Submit Vehicle for Admin Approval'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default SellCarPage;
