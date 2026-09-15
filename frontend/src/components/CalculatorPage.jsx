import React, { useState } from 'react';
import { Calculator, TrendingUp, Tag } from 'lucide-react';
import EMICalculatorWidget from './EMICalculatorWidget';
import OwnershipCalculatorWidget from './OwnershipCalculatorWidget';
import UsedCarValuationWidget from './UsedCarValuationWidget';

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('emi');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900">Financial & Ownership Calculators</h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculate loan EMIs, 5-year total ownership costs, and used car fair market resale prices
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shadow-sm">
          <button
            onClick={() => setActiveTab('emi')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'emi' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" /> EMI Calculator
          </button>

          <button
            onClick={() => setActiveTab('ownership')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'ownership' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Ownership Cost
          </button>

          <button
            onClick={() => setActiveTab('valuation')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'valuation' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" /> Used Valuation
          </button>
        </div>
      </div>

      {activeTab === 'emi' && <EMICalculatorWidget />}
      {activeTab === 'ownership' && <OwnershipCalculatorWidget />}
      {activeTab === 'valuation' && <UsedCarValuationWidget />}

    </div>
  );
};

export default CalculatorPage;
