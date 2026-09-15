import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle2, XCircle, Clock, Trash2, Check, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/listings/my-listings');
      setListings(res.data || []);
    } catch (err) {
      console.error('Failed to load seller listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleMarkSold = async (id) => {
    try {
      await API.put(`/listings/${id}/status`, { status: 'sold' });
      fetchListings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/listings/${id}`);
      fetchListings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting listing');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold">Approved & Live</span>;
    if (status === 'pending') return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold">Pending Review</span>;
    if (status === 'sold') return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold">Marked Sold</span>;
    return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold">Rejected</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2">
            <Tag className="w-7 h-7 text-blue-600" />
            My Used Car Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage your vehicle listings, status, and sales</p>
        </div>

        <Link
          to="/sell"
          className="px-4 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
        >
          <PlusCircle className="w-4 h-4" /> List New Car
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your listings..." />
      ) : listings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center max-w-md mx-auto border border-slate-200 shadow-sm space-y-3">
          <Tag className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Listings Found</h3>
          <p className="text-xs text-slate-500">You haven't posted any used car listings yet.</p>
          <Link to="/sell" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs mt-2 hover:bg-blue-700">
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(item.status)}
                  <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-heading font-bold text-slate-900 text-base">{item.car?.name || 'Vehicle'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.kmDriven?.toLocaleString()} km driven • Condition: {item.condition}</p>

                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Asking Price</span>
                  <span className="font-extrabold text-lg text-slate-900">₹{(item.expectedPrice / 100000).toFixed(2)} Lakh</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                {item.status === 'approved' && (
                  <button
                    onClick={() => handleMarkSold(item._id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold hover:bg-blue-100 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Sold
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-[11px] font-bold flex items-center gap-1 ml-auto transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyListingsPage;

