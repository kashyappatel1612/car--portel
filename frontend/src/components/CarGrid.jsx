import React from 'react';
import CarCard from './CarCard';
import EmptyState from './EmptyState';

const CarGrid = ({ cars = [], loading = false, emptyMessage = 'No vehicles match your search criteria.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 h-[420px] animate-pulse p-4 space-y-4 shadow-sm">
            <div className="bg-slate-200 rounded-xl h-44 w-full"></div>
            <div className="bg-slate-200 rounded h-5 w-3/4"></div>
            <div className="bg-slate-200 rounded h-4 w-1/2"></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-100 rounded h-12"></div>
              <div className="bg-slate-100 rounded h-12"></div>
              <div className="bg-slate-100 rounded h-12"></div>
            </div>
            <div className="bg-slate-200 rounded h-10 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return <EmptyState title="No Cars Found" message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
    </div>
  );
};

export default CarGrid;
