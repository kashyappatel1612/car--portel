import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, Percent } from 'lucide-react';
import API from '../services/api';

const COLORS = ['#2563eb', '#8b5cf6'];

const EMICalculatorWidget = ({ initialPrice = 1200000 }) => {
  const [carPrice, setCarPrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(Math.round(initialPrice * 0.2));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [result, setResult] = useState(null);

  const calculate = async () => {
    try {
      const res = await API.post('/calculator/emi', {
        carPrice: Number(carPrice),
        downPayment: Number(downPayment),
        interestRate: Number(interestRate),
        tenureYears: Number(tenureYears),
      });
      setResult(res.data);
    } catch (err) {
      console.error('EMI Calculation error:', err);
    }
  };

  useEffect(() => {
    calculate();
  }, [carPrice, downPayment, interestRate, tenureYears]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-slate-800">
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900">Car Loan EMI Calculator</h3>
          <p className="text-xs text-slate-500">Estimate your monthly installment and loan breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-5 text-xs">
          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-slate-700">Ex-Showroom Car Price</span>
              <span className="text-blue-600 text-sm">₹{Number(carPrice).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="300000"
              max="10000000"
              step="50000"
              value={carPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCarPrice(val);
                setDownPayment(Math.round(val * 0.2));
              }}
              className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-slate-700">Down Payment ({Math.round((downPayment / carPrice) * 100)}%)</span>
              <span className="text-blue-600 font-extrabold">₹{Number(downPayment).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max={carPrice * 0.8}
              step="25000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Interest Rate (% p.a.)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="18"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Loan Tenure (Years)</label>
              <select
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="1">1 Year (12 mos)</option>
                <option value="3">3 Years (36 mos)</option>
                <option value="5">5 Years (60 mos)</option>
                <option value="7">7 Years (84 mos)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results & Chart */}
        {result && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Monthly EMI Payable</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-1">
                ₹{result.monthlyEMI ? result.monthlyEMI.toLocaleString() : 0} <span className="text-xs text-slate-500 font-normal">/ mo</span>
              </div>
            </div>

            <div className="py-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-semibold">Loan Principal</span>
                <span className="font-extrabold text-slate-900">₹{(result.loanAmount || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-semibold">Total Interest</span>
                <span className="font-extrabold text-purple-600">₹{(result.totalInterest || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-semibold">Total Payable</span>
                <span className="font-extrabold text-blue-600">₹{(result.totalPayment || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Recharts Pie */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.chartData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(result.chartData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `₹${val.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EMICalculatorWidget;
