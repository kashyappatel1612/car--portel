import React from 'react';
import { Trophy, X } from 'lucide-react';
import SmartScoreBadge from './SmartScoreBadge';

const CompareTable = ({ cars = [], onRemove }) => {
  if (!cars || cars.length === 0) return null;

  const getWinnerIndex = (extractor, higherIsBetter = true) => {
    let bestIdx = 0;
    let bestVal = extractor(cars[0]);
    cars.forEach((c, idx) => {
      const val = extractor(c);
      if (higherIsBetter ? val > bestVal : val < bestVal) {
        bestVal = val;
        bestIdx = idx;
      }
    });
    return bestIdx;
  };

  const smartScoreWinner = getWinnerIndex((c) => c.smartScore || c.smartScoreInfo?.overall || 0);
  const priceWinner = getWinnerIndex((c) => c.price, false);
  const mileageWinner = getWinnerIndex((c) => c.mileage || 0);
  const powerWinner = getWinnerIndex((c) => c.horsepower || 0);
  const safetyWinner = getWinnerIndex((c) => c.safetyRating || 0);

  const specRows = [
    { label: 'Smart Score', render: (c) => <SmartScoreBadge score={c.smartScore || c.smartScoreInfo?.overall || 80} />, winnerIdx: smartScoreWinner },
    { label: 'Ex-Showroom Price', render: (c) => `₹${(c.price / 100000).toFixed(2)} Lakh`, winnerIdx: priceWinner },
    { label: 'Estimated EMI', render: (c) => `₹${Math.round((c.price * 0.8 * (8.5 / 12 / 100) * Math.pow(1 + 8.5 / 12 / 100, 60)) / (Math.pow(1 + 8.5 / 12 / 100, 60) - 1)).toLocaleString()}/mo` },
    { label: 'Fuel & Powertrain', render: (c) => c.fuelType },
    { label: 'Fuel Economy / Range', render: (c) => `${c.mileage} ${c.fuelType === 'Electric' ? 'km/charge' : 'kmpl'}`, winnerIdx: mileageWinner },
    { label: 'Transmission', render: (c) => c.transmission },
    { label: 'Engine Capacity', render: (c) => c.engine },
    { label: 'Max Horsepower', render: (c) => `${c.horsepower} bhp`, winnerIdx: powerWinner },
    { label: 'Max Torque', render: (c) => `${c.torque} Nm` },
    { label: 'Safety Rating', render: (c) => `${c.safetyRating} Stars (GNCAP)`, winnerIdx: safetyWinner },
    { label: 'Airbags Count', render: (c) => `${c.airbags} Airbags` },
    { label: 'Boot Capacity', render: (c) => `${c.bootSpace} Liters` },
    { label: 'Ground Clearance', render: (c) => `${c.groundClearance} mm` },
    { label: 'Annual Service Cost', render: (c) => `₹${(c.serviceCost || 5000).toLocaleString()}` },
    { label: 'Annual Insurance', render: (c) => `₹${(c.insuranceCost || 25000).toLocaleString()}` },
    { label: '3-Year Resale Value', render: (c) => `${c.resaleValue || 70}% Retained` },
  ];

  return (
    <div className="space-y-8">
      {/* Scrollable comparison table */}
      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse text-xs min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 w-48 text-slate-500 font-bold uppercase tracking-wider">Specification</th>
              {cars.map((car) => (
                <th key={car._id} className="p-4 text-center min-w-[200px] border-l border-slate-200 relative">
                  {onRemove && (
                    <button
                      onClick={() => onRemove(car._id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Car"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <img
                    src={car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'}
                    alt={car.name}
                    className="w-full h-24 object-cover rounded-xl mb-2 border border-slate-100"
                  />
                  <span className="text-[10px] uppercase font-extrabold text-blue-600 block">{car.brand}</span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{car.name}</h4>
                  <span className="text-[11px] text-slate-500">{car.variant}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {specRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50">{row.label}</td>
                {cars.map((car, cIdx) => {
                  const isWinner = row.winnerIdx === cIdx;
                  return (
                    <td
                      key={car._id}
                      className={`p-4 text-center border-l border-slate-200 font-semibold ${
                        isWinner ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {row.render(car, cIdx)}
                        {isWinner && <Trophy className="w-4 h-4 text-amber-500 inline shrink-0" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Winners Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Comparison Winners & Verdict Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-amber-700 block mb-1">🏆 Best Overall</span>
            <p className="font-bold text-slate-900 text-sm">{cars[smartScoreWinner]?.name}</p>
            <span className="text-[10px] text-slate-500 mt-1 block">Smart Score: {cars[smartScoreWinner]?.smartScore || 85}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-purple-700 block mb-1">💰 Best Value</span>
            <p className="font-bold text-slate-900 text-sm">{cars[priceWinner]?.name}</p>
            <span className="text-[10px] text-slate-500 mt-1 block">Lowest Price: ₹{(cars[priceWinner]?.price / 100000).toFixed(2)}L</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-blue-700 block mb-1">⛽ Best Mileage</span>
            <p className="font-bold text-slate-900 text-sm">{cars[mileageWinner]?.name}</p>
            <span className="text-[10px] text-slate-500 mt-1 block">Efficiency: {cars[mileageWinner]?.mileage} kmpl</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-1">🛡️ Best Safety</span>
            <p className="font-bold text-slate-900 text-sm">{cars[safetyWinner]?.name}</p>
            <span className="text-[10px] text-slate-500 mt-1 block">{cars[safetyWinner]?.safetyRating} Stars GNCAP</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-cyan-700 block mb-1">⚡ Best Performance</span>
            <p className="font-bold text-slate-900 text-sm">{cars[powerWinner]?.name}</p>
            <span className="text-[10px] text-slate-500 mt-1 block">{cars[powerWinner]?.horsepower} bhp / {cars[powerWinner]?.torque} Nm</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompareTable;
