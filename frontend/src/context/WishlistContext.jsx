import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistIds([]);
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get('/wishlist');
      setWishlistItems(res.data);
      setWishlistIds(res.data.map((item) => item.car._id));
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (carId) => {
    if (!isAuthenticated) return false;

    const inList = wishlistIds.includes(carId);
    try {
      if (inList) {
        await API.delete(`/wishlist/${carId}`);
        setWishlistIds((prev) => prev.filter((id) => id !== carId));
        setWishlistItems((prev) => prev.filter((item) => item.car._id !== carId));
      } else {
        await API.post(`/wishlist/${carId}`);
        setWishlistIds((prev) => [...prev, carId]);
        fetchWishlist();
      }
      return !inList;
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      return inList;
    }
  };

  const isInWishlist = (carId) => wishlistIds.includes(carId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        count: wishlistIds.length,
        loading,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
