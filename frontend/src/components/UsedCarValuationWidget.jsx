import React, { useState } from 'react';
import { Tag, Sparkles, CheckCircle2, ArrowDownRight } from 'lucide-react';
import API from '../services/api';

const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Skoda', 'Volkswagen', 'Kia', 'BMW'];

const UsedCarValuationWidget = () => {
  const [form, setForm] = useState({
    originalPrice: 1200000,
    brand: 'Hyundai',
    model: 'Creta',
    year: 2021,
    kmDriven: 35000,
    owners: 1,
    fuelType: 'Petrol',
    condition: 'Good',
    transmission: 'Manual',
  });

  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/calculator/used-car-valuation', form);
      setValuation(res.data);
    } catch (err) {
      console.error('Valuation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-slate-800">
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900">Used Car Fair Price Estimator</h3>
          <p className="text-xs text-slate-500">Calculate fair market resale value using AI valuation algorithm</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs mb-6">
        <div>
          <label className="text-slate-700 font-bold block mb-1">Brand / Make</label>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="text-slate-700 font-bold block mb-1">Original Invoice Price (₹)</label>
          <input
            type="number"
            value={form.originalPrice}
            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="text-slate-700 font-bold block mb-1">Model Year</label>
          <select
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
          >
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-700 font-bold block mb-1">Kilometers Driven</label>
          <input
            type="number"
            step="1000"
            value={form.kmDriven}
            onChange={(e) => setForm({ ...form, kmDriven: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="text-slate-700 font-bold block mb-1">Number of Owners</label>
          <select
            value={form.owners}
            onChange={(e) => setForm({ ...form, owners: Number(e.target.value) })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
          >
            <option value="1">1st Owner</option>
            <option value="2">2nd Owner</option>
            <option value="3">3rd Owner+</option>
          </select>
        </div>

        <div>
          <label className="text-slate-700 font-bold block mb-1">Vehicle Condition</label>
          <select
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
          >
            <option value="Excellent">Excellent (Like New)</option>
            <option value="Good">Good (Minor Scratches)</option>
            <option value="Fair">Fair (Needs Minor Service)</option>
            <option value="Needs Work">Needs Work</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Evaluating...' : 'Get Fair Price'}
          </button>
        </div>
      </form>

      {/* Output Display */}
      {valuation && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-cyan-200 shadow-sm">
            <div>
              <span className="text-xs uppercase font-extrabold text-cyan-600 tracking-wider">Estimated Fair Market Value</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {valuation.formattedRange}
              </div>
              <p className="text-xs text-slate-500 mt-1">Expected median: ₹{(valuation.estimatedFairPrice / 100000).toFixed(2)} Lakh</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-center">
              <span className="text-[10px] block font-bold uppercase text-slate-500">Valuation Confidence</span>
              <span className="text-lg font-extrabold">{valuation.confidence}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Valuation Factors
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {valuation.factors.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <ArrowDownRight className="w-4 h-4 text-purple-600" />
                Future Depreciation Forecast
              </h4>
              <div className="space-y-2">
                {valuation.depreciationForecast.map((d, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-500 font-medium">{d.year}</span>
                    <span className="font-bold text-slate-900">₹{(d.expectedValue / 100000).toFixed(2)} Lakh</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsedCarValuationWidget;
