import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Car, Shield, Tag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Make sure seed data has been run.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-slate-900">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 text-xs">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 mx-auto shadow-md">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">Sign In to AutoSmart AI</h2>
          <p className="text-slate-500">Access your saved wishlist, sell listings, and enquiry dashboard</p>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block text-center">
            Quick 1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@autosmart.ai', 'password123')}
              className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] hover:bg-amber-100 transition-colors flex flex-col items-center gap-1 shadow-sm"
            >
              <Shield className="w-4 h-4 text-amber-600" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('seller@autosmart.ai', 'password123')}
              className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] hover:bg-emerald-100 transition-colors flex flex-col items-center gap-1 shadow-sm"
            >
              <Tag className="w-4 h-4 text-emerald-600" /> Seller
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user@autosmart.ai', 'password123')}
              className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[10px] hover:bg-blue-100 transition-colors flex flex-col items-center gap-1 shadow-sm"
            >
              <User className="w-4 h-4 text-blue-600" /> Buyer User
            </button>
          </div>
        </div>

        {error && <p className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-700 font-bold block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@autosmart.ai"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 text-xs"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-[11px] font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
