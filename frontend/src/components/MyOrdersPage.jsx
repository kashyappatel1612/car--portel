import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  Car,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
} from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const MyOrdersPage = () => {
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('buyer'); // 'buyer' | 'seller'
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        API.get('/orders/my-orders'),
        API.get('/orders/received'),
      ]);
      setBuyerOrders(buyerRes.data || []);
      setSellerOrders(sellerRes.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">Confirmed</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">Completed (Delivered)</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">Requested / Pending</span>;
    }
  };

  const currentList = activeTab === 'buyer' ? buyerOrders : sellerOrders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            Orders & Bookings Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your car purchase reservations, test drive bookings, and sales requests
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'buyer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            My Purchases & Bookings ({buyerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'seller'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Sales Requests Received ({sellerOrders.length})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching vehicle orders and bookings..." />
      ) : currentList.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center max-w-lg mx-auto border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              {activeTab === 'buyer' ? 'No Purchases or Bookings Yet' : 'No Sales Orders Received Yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'buyer'
                ? 'You have not reserved or booked any vehicles. Browse our car catalog to get started.'
                : 'When prospective buyers reserve or book test drives for your listings, they will show up here.'}
            </p>
          </div>
          {activeTab === 'buyer' && (
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white text-xs hover:bg-blue-700 shadow-md transition-all"
            >
              Browse Cars For Sale <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {currentList.map((order) => {
            const car = order.car || {};
            const isBuyerTab = activeTab === 'buyer';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Car & Order Summary */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={car.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold border border-slate-200">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.orderStatus)}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 capitalize">
                        {order.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-xl text-slate-900">
                      <Link to={`/cars/${car._id}`} className="hover:text-blue-600 transition-colors">
                        {car.name || 'Vehicle'}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span>
                        Total Price:{' '}
                        <strong className="text-slate-900">
                          ₹{car.price ? (car.price / 100000).toFixed(2) + ' L' : 'N/A'}
                        </strong>
                      </span>
                      {order.bookingAmount > 0 && (
                        <span>
                          Deposit Paid:{' '}
                          <strong className="text-emerald-600">₹{order.bookingAmount.toLocaleString()}</strong>
                        </span>
                      )}
                      <span>
                        Payment Method: <strong className="text-slate-800 uppercase">{order.paymentMethod}</strong>
                      </span>
                      <span>
                        Date: <strong className="text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</strong>
                      </span>
                    </div>

                    {order.preferredDate && (
                      <p className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl inline-flex items-center gap-1.5 font-medium border border-indigo-100">
                        <Calendar className="w-3.5 h-3.5" /> Target Date:{' '}
                        {new Date(order.preferredDate).toLocaleDateString()}
                      </p>
                    )}

                    {order.notes && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                        "{order.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Contact & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  <div className="text-xs space-y-1 text-slate-600 lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {isBuyerTab ? 'Seller / Dealer Contact' : 'Buyer Contact'}
                    </span>
                    <p className="font-bold text-slate-900">
                      {isBuyerTab ? order.seller?.name || 'Authorized Dealer' : order.buyerContact?.fullName}
                    </p>
                    <p className="flex items-center gap-1 lg:justify-end">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {isBuyerTab ? order.seller?.phone || '+91 99999 88888' : order.buyerContact?.phone}
                    </p>
                    <p className="flex items-center gap-1 lg:justify-end">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {isBuyerTab ? order.seller?.email || 'sales@autosmart.ai' : order.buyerContact?.email}
                    </p>
                    {order.buyerContact?.city && (
                      <p className="flex items-center gap-1 lg:justify-end text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.buyerContact.city}
                      </p>
                    )}
                  </div>

                  {/* Actions for Seller */}
                  {!isBuyerTab && (
                    <div className="flex items-center gap-2 pt-2">
                      {order.orderStatus === 'requested' && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                          className="px-3.5 py-1.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-xs"
                        >
                          Confirm Booking
                        </button>
                      )}

                      {['requested', 'confirmed'].includes(order.orderStatus) && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusUpdate(order._id, 'completed')}
                          className="px-3.5 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-xs"
                        >
                          Mark Completed (Sold)
                        </button>
                      )}

                      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs border border-rose-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}

                  {isBuyerTab && (
                    <Link
                      to={`/cars/${car._id}`}
                      className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs"
                    >
                      View Car Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
