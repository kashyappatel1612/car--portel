import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Car, Tag, MessageSquare, DollarSign, BarChart3, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import API from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const COLORS = ['#2563EB', '#7C3AED', '#0891B2', '#059669', '#D97706', '#DC2626'];

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching Portal Admin Telemetry & Charts..." />;
  if (!data) return <div className="text-center py-20 text-slate-500">Failed to load admin stats.</div>;

  const { kpis, charts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" /> Portal Control Center
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-slate-900">Admin Overview & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Platform KPIs, listing approval queues, user management & charts</p>
        </div>

        {/* Quick Admin Navigation */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <Link to="/admin/listings" className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 transition-colors">
            <Clock className="w-3.5 h-3.5" /> Pending ({kpis.pendingListings})
          </Link>
          <Link to="/admin/users" className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors shadow-sm">
            <Users className="w-3.5 h-3.5 text-blue-600" /> Users ({kpis.totalUsers})
          </Link>
          <Link to="/admin/cars" className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors shadow-sm">
            <Car className="w-3.5 h-3.5 text-purple-600" /> Database ({kpis.totalCars})
          </Link>
          <Link to="/admin/reports" className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors shadow-sm">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Users</span>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.totalUsers}</div>
          <span className="text-[10px] text-slate-400 block">+{kpis.totalSellers} Sellers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Catalog Vehicles</span>
          <div className="text-2xl font-extrabold text-blue-600">{kpis.totalCars}</div>
          <span className="text-[10px] text-slate-400 block">Ex-Showroom Cars</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Listings</span>
          <div className="text-2xl font-extrabold text-emerald-600">{kpis.activeListings}</div>
          <span className="text-[10px] text-slate-400 block">{kpis.pendingListings} Pending Approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Average Vehicle Price</span>
          <div className="text-2xl font-extrabold text-purple-600">₹{(kpis.avgPrice / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-slate-400 block">{kpis.totalEnquiries} Total Enquiries</span>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Activity Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-heading font-bold text-sm text-slate-900">Monthly Platform Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyActivity || []}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="listings" fill="#2563EB" name="Listings Posted" />
                <Bar dataKey="enquiries" fill="#7C3AED" name="Buyer Enquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cars by Fuel Type Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-heading font-bold text-sm text-slate-900">Inventory Share by Fuel Type</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.carsByFuel || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts.carsByFuel || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Price Distribution Bar Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-heading font-bold text-sm text-slate-900">Vehicle Distribution Across Price Tiers</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.priceRanges || []}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', color: '#0f172a' }} />
              <Bar dataKey="count" fill="#059669" name="Number of Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;

