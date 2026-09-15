import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  GitCompare,
  PlusCircle,
  ShieldCheck,
  Zap,
  Cpu,
  ArrowRight,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import API from '../services/api';
import CarGrid from '../components/CarGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'BMW', 'Mercedes-Benz'];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    search: '',
    brand: '',
    maxPrice: '',
    fuelType: '',
    bodyType: '',
    location: '',
  });

  const [categories, setCategories] = useState({
    under10Lakh: [],
    familyCars: [],
    bestMileage: [],
    bestSafety: [],
  });
  const [trendingCars, setTrendingCars] = useState([]);
  const [activeTab, setActiveTab] = useState('under10Lakh');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, carRes] = await Promise.all([
          API.get('/cars/categories'),
          API.get('/cars?sort=popularity&limit=6'),
        ]);
        setCategories(catRes.data);
        setTrendingCars(carRes.data.cars || []);
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.search) query.append('search', searchParams.search);
    if (searchParams.brand) query.append('brand', searchParams.brand);
    if (searchParams.maxPrice) query.append('maxPrice', searchParams.maxPrice);
    if (searchParams.fuelType) query.append('fuelType', searchParams.fuelType);
    if (searchParams.bodyType) query.append('bodyType', searchParams.bodyType);
    if (searchParams.location) query.append('location', searchParams.location);

    navigate(`/cars?${query.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50">
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" /> Next-Gen AI Automotive Portal
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Find Your Perfect Car with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">AI Precision</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Compare cars, calculate ownership costs, discover fair used-car market prices, and make smarter buying decisions.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => navigate('/cars')}
              className="px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 flex items-center gap-2 text-xs"
            >
              <Search className="w-4 h-4" /> Find My Car
            </button>
            <Link
              to="/compare"
              className="px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-all flex items-center gap-2 text-xs shadow-sm"
            >
              <GitCompare className="w-4 h-4 text-blue-600" /> Compare Cars
            </Link>
            <Link
              to="/sell"
              className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all shadow-md text-xs flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Sell My Car
            </Link>
          </div>

          {/* Multi-attribute Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-12 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xl max-w-5xl mx-auto text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              
              <div className="lg:col-span-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Search Keywords</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Swift, Nexon, Creta..."
                    value={searchParams.search}
                    onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Brand</label>
                <select
                  value={searchParams.brand}
                  onChange={(e) => setSearchParams({ ...searchParams, brand: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="">All Brands</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Max Budget</label>
                <select
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="">Any Budget</option>
                  <option value="800000">Under ₹8 Lakh</option>
                  <option value="1200000">Under ₹12 Lakh</option>
                  <option value="2000000">Under ₹20 Lakh</option>
                  <option value="3500000">Under ₹35 Lakh</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Fuel Type</label>
                <select
                  value={searchParams.fuelType}
                  onChange={(e) => setSearchParams({ ...searchParams, fuelType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="">Any Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-all text-xs shadow-md shadow-blue-600/20"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>

            </div>
          </form>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Smart Score (0–100)</h4>
              <p className="text-xs text-slate-500 mt-1">Multi-metric rating evaluating safety, resale, performance, and maintenance.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Dynamic Comparison</h4>
              <p className="text-xs text-slate-500 mt-1">Compare up to 4 vehicles side-by-side with automated winner badges.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">AI Car Advisor</h4>
              <p className="text-xs text-slate-500 mt-1">10-question questionnaire generating custom top 3 matches tailored to your lifestyle.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Used Car Fair Valuation</h4>
              <p className="text-xs text-slate-500 mt-1">Depreciation calculation estimating exact fair market resale value range.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">Explore Top Rated Vehicles</h2>
            <p className="text-xs text-slate-500">Curated categories based on real market performance & safety standards</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 text-xs shadow-sm">
            <button
              onClick={() => setActiveTab('under10Lakh')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'under10Lakh' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Best Under ₹10L
            </button>
            <button
              onClick={() => setActiveTab('familyCars')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'familyCars' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Best Family Cars
            </button>
            <button
              onClick={() => setActiveTab('bestMileage')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'bestMileage' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Best Mileage
            </button>
            <button
              onClick={() => setActiveTab('bestSafety')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'bestSafety' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5-Star Safety
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <CarGrid cars={categories[activeTab] || []} />
        )}
      </section>

      {/* Trending Cars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Trending & Most Popular Cars
            </h2>
            <p className="text-xs text-slate-500">Most viewed and searched models this month</p>
          </div>
          <Link
            to="/cars"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Cars <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <CarGrid cars={trendingCars} />
      </section>

      {/* Why AutoSmart AI Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase">
                Why Choose AutoSmart AI?
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-slate-900 leading-tight">
                Empowering Smart Car Buying with Algorithmic Intelligence
              </h2>
              <p className="text-slate-600 text-xs leading-relaxed">
                Car buying shouldn't involve guesswork. AutoSmart AI integrates 25+ vehicle metrics, GNCAP safety telemetry, real-world maintenance costs, and market resale data to give you unbiased recommendations.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Comprehensive 0-100 Smart Score for every vehicle</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive EMI and 5-Year Ownership Cost calculators</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Rule-based & AI-driven car recommendation engine</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct buyer-to-seller enquiries and verified dealer directory</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/advisor"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/20 text-xs"
                >
                  Try AI Advisor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-blue-600">30+</div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">Popular Car Models</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-indigo-600">100%</div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">Unbiased Smart Scores</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-purple-600">10+</div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">Verified Dealer Showrooms</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-emerald-600">₹0</div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">Free Valuation Tools</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
