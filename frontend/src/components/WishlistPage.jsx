import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import CarGrid from './CarGrid';
import LoadingSpinner from './LoadingSpinner';

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();

  const cars = wishlistItems.map((item) => item.car);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
        <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
          <Heart className="w-6 h-6 fill-rose-500/20" />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900">My Saved Wishlist</h1>
          <p className="text-xs text-slate-500">Manage your saved vehicles across sessions</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your saved wishlist..." />
      ) : (
        <CarGrid cars={cars} emptyMessage="You haven't saved any vehicles to your wishlist yet." />
      )}
    </div>
  );
};

export default WishlistPage;

