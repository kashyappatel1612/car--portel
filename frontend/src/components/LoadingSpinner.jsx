import React from 'react';
import { Car } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading AutoSmart AI...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-14 h-14 flex items-center justify-center mb-3">
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
        <Car className="w-6 h-6 text-blue-600 animate-pulse" />
      </div>
      <p className="text-xs font-bold text-slate-700">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
