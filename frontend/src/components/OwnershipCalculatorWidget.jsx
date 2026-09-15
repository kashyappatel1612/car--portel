import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import API from '../services/api';

const OwnershipCalculatorWidget = ({ initialPrice = 1400000, initialMileage = 18 }) => {
  const [carPrice, setCarPrice] = useState(initialPrice);
  const [annualKms, setAnnualKms] = useState(12000);
  const [mileage, setMileage] = useState(initialMileage);
  const [fuelPrice, setFuelPrice] = useState(100);
  const [serviceCost, setServiceCost] = useState(7000);
  const [insurance, setInsurance] = useState(28000);
  const [result, setResult] = useState(null);

  const calculate = async () => {
    try {
      const res = await API.post('/calculator/ownership', {
        carPrice: Number(carPrice),
        annualKms: Number(annualKms),
        mileage: Number(mileage),
        fuelPrice: Number(fuelPrice),
        serviceCostAnnual: Number(serviceCost),
        insuranceAnnual: Number(insurance),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    calculate();
  }, [carPrice, annualKms, mileage, fuelPrice, serviceCost, insurance]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-slate-800">
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900">5-Year Total Ownership Cost Calculator</h3>
          <p className="text-xs text-slate-500">Calculate fuel, service, insurance, tyres & net depreciation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-bold block mb-1">Car Ex-Showroom Price (₹)</label>
            <input
              type="number"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Annual Distance: {annualKms.toLocaleString()} km/yr</label>
            <input
              type="range"
              min="5000"
              max="30000"
              step="1000"
              value={annualKms}
              onChange={(e) => setAnnualKms(e.target.value)}
              className="w-full accent-purple-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Mileage (kmpl)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Fuel Price (₹/L)</label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Results & Chart */}
        {result && (
          <div className="lg:col-span-2 space-y-4">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] text-slate-500 block font-semibold">1-Year Net Cost</span>
                <span className="font-heading font-extrabold text-base text-blue-600">₹{(result.year1Cost || 0).toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] text-slate-500 block font-semibold">3-Year Net Cost</span>
                <span className="font-heading font-extrabold text-base text-purple-600">₹{(result.year3Cost || 0).toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] text-slate-500 block font-semibold">5-Year Cumulative</span>
                <span className="font-heading font-extrabold text-base text-emerald-600">₹{(result.year5Cost || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Recharts Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.breakdown || []}>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} formatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(val) => `₹${val.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '11px', color: '#0f172a' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="fuel" fill="#2563eb" name="Fuel Cost" stackId="a" />
                  <Bar dataKey="service" fill="#8b5cf6" name="Service" stackId="a" />
                  <Bar dataKey="insurance" fill="#06b6d4" name="Insurance" stackId="a" />
                  <Bar dataKey="tyres" fill="#f59e0b" name="Tyre Replacement" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default OwnershipCalculatorWidget;
