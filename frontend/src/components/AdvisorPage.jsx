import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import API from '../services/api';
import CarCard from './CarCard';
import LoadingSpinner from './LoadingSpinner';

const AdvisorPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budgetMax: 1500000,
    monthlyIncome: 120000,
    familySize: 4,
    dailyDistance: 30,
    usageRatio: '70% City / 30% Highway',
    fuelPref: 'Any',
    transmissionPref: 'Any',
    bodyTypePref: 'Any',
    priority: 'Safety',
    expectedOwnershipYears: 5,
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post('/advisor/recommend', formData);
      setRecommendations(res.data);
      setStep(3);
    } catch (err) {
      console.error('Advisor API error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-indigo-600" /> AI Automotive Recommendation Engine
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
          AutoSmart <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">AI Car Advisor</span>
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Answer a quick 10-question questionnaire about your budget, family size, driving habits, and priorities to receive your personalized top 3 vehicle matches.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center justify-center gap-4 text-xs font-bold max-w-md mx-auto">
        <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
          Lifestyle & Budget
        </span>
        <span className="text-slate-300">—</span>
        <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
          Preferences & Priorities
        </span>
        <span className="text-slate-300">—</span>
        <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
          Top Matches
        </span>
      </div>

      {/* Step 1: Budget & Driving Lifestyle */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 text-xs">
          <h3 className="font-heading font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Step 1: Budget & Driving Requirements
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-700">Maximum Vehicle Budget</span>
                <span className="text-indigo-600 font-extrabold text-sm">₹{(formData.budgetMax / 100000).toFixed(1)} Lakh</span>
              </div>
              <input
                type="range"
                min="500000"
                max="6000000"
                step="100000"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                className="w-full accent-indigo-600 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Monthly Household Income (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Family Size (Passengers)</label>
                <select
                  value={formData.familySize}
                  onChange={(e) => setFormData({ ...formData, familySize: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="2">2 (Couple)</option>
                  <option value="4">4 (Standard Family)</option>
                  <option value="5">5 (Comfortable 5-Seater)</option>
                  <option value="6">6+ (Large / Joint Family)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Daily Driving Distance (km/day)</label>
                <input
                  type="number"
                  value={formData.dailyDistance}
                  onChange={(e) => setFormData({ ...formData, dailyDistance: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Driving Ratio</label>
                <select
                  value={formData.usageRatio}
                  onChange={(e) => setFormData({ ...formData, usageRatio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="80% City / 20% Highway">80% City / 20% Highway (Heavy Traffic)</option>
                  <option value="50% City / 50% Highway">50% City / 50% Highway (Mixed)</option>
                  <option value="20% City / 80% Highway">20% City / 80% Highway (Long Drives)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/20 text-xs"
            >
              Continue to Step 2 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preferences & Priorities */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 text-xs">
          <h3 className="font-heading font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Step 2: Powertrain & Priority Preferences
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Fuel Preference</label>
                <select
                  value={formData.fuelPref}
                  onChange={(e) => setFormData({ ...formData, fuelPref: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Any">Any Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Transmission</label>
                <select
                  value={formData.transmissionPref}
                  onChange={(e) => setFormData({ ...formData, transmissionPref: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Any">Any Transmission</option>
                  <option value="Automatic">Automatic (DCT/CVT/AMT)</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Body Style</label>
                <select
                  value={formData.bodyTypePref}
                  onChange={(e) => setFormData({ ...formData, bodyTypePref: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Any">Any Body Style</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="MUV">MUV / MPV</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-2">Primary Decision Factor</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Safety', 'Mileage', 'Performance', 'Value'].map((p) => {
                  const active = formData.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Expected Ownership Tenure</label>
              <select
                value={formData.expectedOwnershipYears}
                onChange={(e) => setFormData({ ...formData, expectedOwnershipYears: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              >
                <option value="3">3 Years (Frequent Upgrader)</option>
                <option value="5">5 Years (Standard Ownership)</option>
                <option value="7">7+ Years (Long-Term Retention)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Synthesizing Matches...' : 'Generate AI Recommendations'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Top Recommendations Output */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Top 3 Recommended Vehicles</h3>
              <p className="text-xs text-slate-500">Based on your ₹{(formData.budgetMax / 100000).toFixed(1)}L budget & {formData.priority} priority</p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Evaluating 30+ vehicles against your lifestyle profile..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations?.recommendations?.map((rec, idx) => (
                <div key={rec.car._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between relative">
                  
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-xs shadow-md">
                    #{idx + 1} Match ({rec.score}% Fit)
                  </div>

                  <CarCard car={rec.car} />

                  <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-indigo-700 block mb-1">Why it matches:</span>
                      <p className="text-slate-700 leading-relaxed text-[11px] font-medium">{rec.matchReason}</p>
                    </div>

                    <div>
                      <span className="font-bold text-emerald-700 block mb-1">Key Advantages:</span>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {rec.advantages.map((adv, i) => (
                          <li key={i} className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdvisorPage;
