import React, { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reviews/my-reviews');
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="pb-6 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
          My Written Reviews
        </h1>
        <p className="text-xs text-slate-500 mt-1">Car reviews written by your account</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your reviews..." />
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center max-w-md mx-auto border border-slate-200 shadow-sm space-y-2">
          <Star className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Written Reviews</h3>
          <p className="text-xs text-slate-500">You haven't written any vehicle reviews yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{rev.car?.name || 'Car Review'}</span>
                <div className="flex items-center text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>

              <p className="font-semibold text-slate-800">{rev.title}</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">{rev.comment}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
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

export default MyReviewsPage;

