import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

const EmptyState = ({ title = 'No Results Found', message = 'Try adjusting your search query or filters.', onReset }) => {
  return (
    <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto my-8 border border-slate-200 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
