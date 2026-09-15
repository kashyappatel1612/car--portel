import React, { useState } from 'react';
import { Sparkles, Shield, Fuel, Zap, DollarSign, Wrench, RefreshCw, Info, X } from 'lucide-react';

const SmartScoreBadge = ({ score = 85, scoreInfo, compact = false, showModal = true }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getScoreColor = (val) => {
    if (val >= 85) return 'from-emerald-600 to-teal-500 text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 75) return 'from-blue-600 to-cyan-500 text-blue-700 bg-blue-50 border-blue-200';
    if (val >= 65) return 'from-amber-600 to-yellow-500 text-amber-700 bg-amber-50 border-amber-200';
    return 'from-rose-600 to-red-500 text-rose-700 bg-rose-50 border-rose-200';
  };

  const subScores = scoreInfo?.subScores || {
    safety: Math.min(100, score + 2),
    mileage: Math.min(100, score - 3),
    performance: Math.min(100, score + 1),
    valueForMoney: Math.min(100, score - 2),
    maintenance: Math.min(100, score - 5),
    resale: Math.min(100, score - 1),
  };

  const metrics = [
    { label: 'Safety Rating', score: subScores.safety, icon: Shield, color: 'bg-emerald-500' },
    { label: 'Fuel Economy & Range', score: subScores.mileage, icon: Fuel, color: 'bg-blue-500' },
    { label: 'Power & Performance', score: subScores.performance, icon: Zap, color: 'bg-amber-500' },
    { label: 'Value for Money', score: subScores.valueForMoney, icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Maintenance Cost', score: subScores.maintenance, icon: Wrench, color: 'bg-teal-500' },
    { label: 'Estimated Resale', score: subScores.resale, icon: RefreshCw, color: 'bg-indigo-500' },
  ];

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
        <span className="text-slate-600">Smart Score:</span>
        <span className="text-blue-600 font-extrabold">{score}/100</span>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => showModal && setModalOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer hover:scale-105 transition-all shadow-sm ${getScoreColor(
          score
        )}`}
      >
        <Sparkles className="w-4 h-4 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Smart Score</span>
          <span className="text-xs font-extrabold text-slate-900">{score} <span className="text-[10px] text-slate-400 font-normal">/ 100</span></span>
        </div>
      </div>

      {/* Modal for Score Breakdown */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-900">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-extrabold text-xl">
                {score}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Smart Score Breakdown
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </h3>
                <p className="text-xs text-slate-500">Algorithmic evaluation across 6 key metrics</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4">
              {metrics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                        {item.label}
                      </span>
                      <span className="font-extrabold text-slate-900">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Calculated dynamically using safety ratings, performance output, price-to-feature ratio, long-term maintenance estimates, and 3-year resale algorithms.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartScoreBadge;
