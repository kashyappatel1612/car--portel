import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Tag, MessageSquare, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import API from '../services/api';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [stats, setStats] = useState({
    myListingsCount: 0,
    myEnquiriesCount: 0,
    myReviewsCount: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [listRes, enqRes, revRes] = await Promise.all([
          API.get('/listings/my-listings'),
          API.get('/enquiries/my-enquiries'),
          API.get('/reviews/my-reviews'),
        ]);
        setStats({
          myListingsCount: listRes.data.length || 0,
          myEnquiriesCount: (enqRes.data.sent?.length || 0) + (enqRes.data.received?.length || 0),
          myReviewsCount: revRes.data.length || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/60 via-white to-white">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Logged in as {user?.role?.toUpperCase()}
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your saved wishlist, sell listings, enquiries and car reviews</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/sell"
            className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md shadow-blue-600/20"
          >
            Sell a Car
          </Link>
          <Link
            to="/advisor"
            className="px-5 py-2.5 rounded-xl font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs"
          >
            AI Advisor
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link to="/wishlist" className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 block group hover:shadow-xl hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Wishlist Saved</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{wishlistCount}</div>
          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-bold">View Saved Cars <ArrowRight className="w-3 h-3" /></span>
        </Link>

        <Link to="/my-listings" className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 block group hover:shadow-xl hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">My Listings</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{stats.myListingsCount}</div>
          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-bold">Manage Inventory <ArrowRight className="w-3 h-3" /></span>
        </Link>

        <Link to="/my-enquiries" className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 block group hover:shadow-xl hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Enquiries</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{stats.myEnquiriesCount}</div>
          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-bold">Buyer & Seller Queries <ArrowRight className="w-3 h-3" /></span>
        </Link>

        <Link to="/my-reviews" className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 block group hover:shadow-xl hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Written Reviews</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{stats.myReviewsCount}</div>
          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-bold">View Car Reviews <ArrowRight className="w-3 h-3" /></span>
        </Link>

      </div>

    </div>
  );
};

export default UserDashboardPage;
