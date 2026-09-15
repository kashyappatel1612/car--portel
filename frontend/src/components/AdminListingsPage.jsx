import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const AdminListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/listings/pending');
      setListings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await API.put(`/listings/${id}/status`, { status: newStatus });
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="pb-6 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2">
          <Clock className="w-7 h-7 text-amber-500" />
          Pending Listing Approval Queue ({listings.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review user-submitted used car listings before authorizing public marketplace display</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading pending listing queue..." />
      ) : listings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center max-w-md mx-auto border border-slate-200 shadow-sm space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Queue Clear!</h3>
          <p className="text-xs text-slate-500">There are no pending user car listings awaiting approval right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    Pending Approval
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-heading font-bold text-slate-900 text-base">{item.car?.name || 'Vehicle'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Seller: {item.seller?.name} ({item.seller?.email})</p>
                <p className="text-xs text-slate-600 mt-1">{item.kmDriven?.toLocaleString()} km • Condition: {item.condition}</p>

                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Expected Price</span>
                  <span className="font-extrabold text-lg text-slate-900">₹{(item.expectedPrice / 100000).toFixed(2)} Lakh</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleAction(item._id, 'approved')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve Live
                </button>
                <button
                  onClick={() => handleAction(item._id, 'rejected')}
                  className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminListingsPage;

