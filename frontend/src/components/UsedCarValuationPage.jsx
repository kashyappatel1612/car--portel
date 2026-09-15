import React from 'react';
import UsedCarValuationWidget from './UsedCarValuationWidget';

const UsedCarValuationPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-slate-900">Used Car Fair Market Valuation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Estimate instant fair price valuation range before buying or selling a pre-owned vehicle
        </p>
      </div>
      <UsedCarValuationWidget />
    </div>
  );
};

export default UsedCarValuationPage;
