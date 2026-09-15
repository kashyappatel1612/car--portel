import React, { useState, useEffect } from 'react';
import { Compass, MessageSquare, Phone, Mail, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const MyEnquiriesPage = () => {
  const [data, setData] = useState({ sent: [], received: [] });
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await API.get('/enquiries/my-enquiries');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/enquiries/${id}/status`, { status });
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const list = activeTab === 'received' ? data.received : data.sent;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-purple-600" />
            Enquiry Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">Track messages from prospective buyers and seller responses</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'received' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Received as Seller ({data.received.length})
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'sent' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sent as Buyer ({data.sent.length})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading enquiries..." />
      ) : list.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center max-w-md mx-auto border border-slate-200 shadow-sm space-y-2">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Enquiries Found</h3>
          <p className="text-xs text-slate-500">No {activeTab} enquiry records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{item.car?.name || 'Vehicle'}</span>
                  <span className="text-slate-500 block text-[11px]">
                    {activeTab === 'received' ? `Buyer: ${item.buyer?.name} (${item.buyer?.email})` : `Seller: ${item.seller?.name || 'Authorized Seller'}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase">
                    Status: {item.status}
                  </span>

                  {activeTab === 'received' && item.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusChange(item._id, 'closed')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Mark Closed
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                <span className="text-slate-500 block text-[10px] font-semibold mb-1">Message:</span>
                "{item.message}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Phone: {item.phone || item.buyer?.phone || 'N/A'}</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyEnquiriesPage;

