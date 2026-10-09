import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  X,
  CreditCard,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const BuyCarModal = ({ car, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('booking'); // 'booking' | 'test_drive' | 'direct_purchase'
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: car?.location || '',
    deliveryAddress: '',
    preferredDate: '',
    paymentMethod: 'upi',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen || !car) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/orders', {
        carId: car._id,
        listingId: car.listingId || null,
        type: orderType,
        bookingAmount: orderType === 'test_drive' ? 0 : 10000,
        preferredDate: formData.preferredDate || null,
        paymentMethod: formData.paymentMethod,
        buyerContact: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          deliveryAddress: formData.deliveryAddress,
        },
        notes: formData.notes,
      });

      setCreatedOrder(res.data.order);
      if (onSuccess) onSuccess(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process purchase request.');
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice =
    car.price >= 100000 ? (car.price / 100000).toFixed(2) + ' Lakh' : '₹' + car.price.toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-slate-900 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">Sign in to Buy or Book</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Please log in to your AutoSmart account to reserve this vehicle, book a test drive, or contact the seller.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
              >
                Cancel
              </button>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        ) : createdOrder ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Order Reference: {createdOrder.orderNumber}
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-3">
                {orderType === 'test_drive' ? 'Test Drive Scheduled!' : 'Vehicle Successfully Reserved!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {orderType === 'test_drive'
                  ? `Your test drive appointment for ${car.name} has been booked. The seller will contact you to coordinate timing.`
                  : `Congratulations! Your reservation token has been registered for ${car.name}. Our partner dealer / seller will reach out for documentation.`}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Vehicle:</span>
                <span className="font-bold text-slate-900">{car.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Vehicle Price:</span>
                <span className="font-bold text-slate-900">₹{formattedPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Booking Deposit Paid:</span>
                <span className="font-bold text-emerald-600">
                  {orderType === 'test_drive' ? 'Free (₹0)' : '₹10,000 (Refundable)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="font-bold uppercase tracking-wider text-blue-600">{createdOrder.orderStatus}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
              >
                Close
              </button>
              <Link
                to="/my-orders"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" /> Go to My Orders
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                  {car.brand}
                </span>
                <span className="text-xs text-slate-500">{car.year} • {car.fuelType} • {car.transmission}</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-0.5">{car.name}</h3>
              <p className="text-xs text-slate-500">Ex-Showroom: <span className="font-bold text-slate-900">₹{formattedPrice}</span></p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Select Type */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1.5">Select Service</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('booking')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    orderType === 'booking'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <span className="block font-bold text-[11px]">Token Booking</span>
                  <span className="text-[10px] text-slate-500">₹10,000 Deposit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('test_drive')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    orderType === 'test_drive'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span className="block font-bold text-[11px]">Test Drive</span>
                  <span className="text-[10px] text-slate-500">100% Free</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('direct_purchase')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    orderType === 'direct_purchase'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="block font-bold text-[11px]">Direct Buy</span>
                  <span className="text-[10px] text-slate-500">Full Purchase</span>
                </button>
              </div>
            </div>

            {/* Step 2: Contact Info */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {orderType === 'test_drive' ? 'Test Drive Date' : 'Target Handover Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-700 font-bold mb-1">City / Delivery Location</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  placeholder="e.g. Mumbai, Maharashtra"
                />
              </div>

              {/* Step 3: Payment Method */}
              {orderType !== 'test_drive' && (
                <div className="text-xs">
                  <label className="block text-slate-700 font-bold mb-1">Payment / Settlement Option</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value="upi">UPI (Instant Booking Confirmation)</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="offline_dealership">Pay at Showroom / On Physical Inspection</option>
                  </select>
                </div>
              )}

              <div className="text-xs">
                <label className="block text-slate-700 font-bold mb-1">Notes / Custom Request (Optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  placeholder="e.g. Please bring vehicle to home address for test drive"
                />
              </div>
            </div>

            {/* Bottom Guarantee and Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>AutoSmart Verified • 100% Refund Guarantee</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {loading
                    ? 'Processing...'
                    : orderType === 'test_drive'
                    ? 'Book Test Drive'
                    : orderType === 'booking'
                    ? 'Pay ₹10,000 & Reserve'
                    : 'Submit Purchase'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BuyCarModal;
