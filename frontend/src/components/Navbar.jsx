import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  Compass,
  GitCompare,
  Calculator,
  PlusCircle,
  Heart,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Tag,
  Store,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                AutoSmart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 -mt-1 font-medium tracking-wide uppercase">Automotive Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/cars"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/cars') ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              Browse Cars
            </Link>

            <Link
              to="/compare"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/compare') ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare
              {compareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              to="/advisor"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/advisor') ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Advisor
            </Link>

            <Link
              to="/calculator"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/calculator') ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Calculators
            </Link>

            <Link
              to="/used-car-value"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/used-car-value') ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-4 h-4 text-cyan-600" />
              Used Valuation
            </Link>

            <Link
              to="/dealers"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/dealers') ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              Dealers
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Sell Car Button */}
            <Link
              to="/sell"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Sell Car
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                    {user.role}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-slate-200 text-xs font-medium"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-amber-600 hover:bg-amber-50 font-bold"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        Admin Control Center
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      Orders & Bookings
                    </Link>

                    <Link
                      to="/my-listings"
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Tag className="w-4 h-4 text-emerald-600" />
                      My Listings
                    </Link>

                    <Link
                      to="/my-enquiries"
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Compass className="w-4 h-4 text-purple-600" />
                      My Enquiries
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Profile Settings
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-xl">
          <Link
            to="/cars"
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Cars
          </Link>
          <Link
            to="/compare"
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            Compare Vehicles ({compareCount})
          </Link>
          <Link
            to="/advisor"
            className="block px-3 py-2 rounded-xl text-indigo-600 hover:bg-indigo-50 font-semibold text-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            AI Car Advisor
          </Link>
          <Link
            to="/calculator"
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            Calculators (EMI & Ownership)
          </Link>
          <Link
            to="/used-car-value"
            className="block px-3 py-2 rounded-xl text-cyan-600 hover:bg-slate-100 font-semibold text-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            Used Car Valuation
          </Link>
          <Link
            to="/dealers"
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Dealers
          </Link>
          <Link
            to="/sell"
            className="block w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sell Your Car
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
