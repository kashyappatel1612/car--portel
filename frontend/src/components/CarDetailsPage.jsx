import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Fuel,
  Gauge,
  Heart,
  GitCompare,
  MessageSquare,
  Calculator,
  Star,
  CheckCircle,
  XCircle,
  Wrench,
  RefreshCw,
  TrendingUp,
  MapPin,
  Send,
  X,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import SmartScoreBadge from './SmartScoreBadge';
import LoadingSpinner from './LoadingSpinner';

const CarDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const [car, setCar] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], avgRating: 0, total: 0 });
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquirySent, setEnquirySent] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchDetails = async () => {
    try {
      const [carRes, reviewRes, priceRes] = await Promise.all([
        API.get(`/cars/${id}`),
        API.get(`/reviews/car/${id}`),
        API.get(`/price-history/car/${id}`),
      ]);
      setCar(carRes.data);
      setReviewsData(reviewRes.data);
      setPriceHistory(priceRes.data);
    } catch (err) {
      console.error('Failed to load car details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner text="Fetching Vehicle Specs & Telemetry..." />;
  if (!car) return <div className="text-center py-20 text-slate-500">Car not found.</div>;

  const inWishlist = isInWishlist(car._id);
  const inCompare = isInCompare(car._id);
  const priceInLakhs = car.price >= 100000 ? (car.price / 100000).toFixed(2) + ' Lakh' : '₹' + car.price.toLocaleString();
  const estimatedEMI = Math.round((car.price * 0.8 * (8.5 / 12 / 100) * Math.pow(1 + 8.5 / 12 / 100, 60)) / (Math.pow(1 + 8.5 / 12 / 100, 60) - 1));

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    try {
      await API.post('/enquiries', {
        carId: car._id,
        message: enquiryMessage,
        phone: enquiryPhone,
      });
      setEnquirySent(true);
      setTimeout(() => {
        setEnquiryModalOpen(false);
        setEnquirySent(false);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit enquiry');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await API.post(`/reviews/car/${car._id}`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewSubmitted(true);
      fetchDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-900">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              {car.brand}
            </span>
            <span className="text-xs text-slate-500 font-medium">{car.year} Model • {car.bodyType}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">{car.name}</h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" /> Location: {car.location || 'Pan India'}
          </p>
        </div>

        {/* Pricing & CTA Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Ex-Showroom Price</span>
            <span className="font-heading font-extrabold text-2xl text-slate-900">₹{priceInLakhs}</span>
            <span className="text-xs text-blue-600 font-bold block mt-0.5">EMI Starts ₹{estimatedEMI.toLocaleString()}/mo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(car._id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                inWishlist ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={() => addToCompare(car)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                inCompare ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              {inCompare ? 'In Compare' : 'Add to Compare'}
            </button>

            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" /> Contact Seller
            </button>
          </div>
        </div>
      </div>

      {/* Main Spec Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gallery & Specs (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image */}
          <div className="bg-white rounded-3xl overflow-hidden h-80 sm:h-96 w-full relative border border-slate-200 shadow-sm">
            <img
              src={car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop'}
              alt={car.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <SmartScoreBadge score={car.smartScore || car.smartScoreInfo?.overall || 85} scoreInfo={car.smartScoreInfo} />
            </div>
          </div>

          {/* Key Specification Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Key Specifications & Telemetry</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <Fuel className="w-4 h-4 text-blue-600 mb-1" />
                <span className="text-slate-500 block text-[10px] font-semibold">Fuel Economy</span>
                <span className="font-bold text-slate-900 text-sm">{car.mileage} {car.fuelType === 'Electric' ? 'km/chg' : 'kmpl'}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <Gauge className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-slate-500 block text-[10px] font-semibold">Horsepower</span>
                <span className="font-bold text-slate-900 text-sm">{car.horsepower} bhp</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <Shield className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-slate-500 block text-[10px] font-semibold">Safety Rating</span>
                <span className="font-bold text-emerald-600 text-sm">{car.safetyRating} Stars ({car.airbags} Airbags)</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <Wrench className="w-4 h-4 text-purple-600 mb-1" />
                <span className="text-slate-500 block text-[10px] font-semibold">Engine Spec</span>
                <span className="font-bold text-slate-900 text-sm">{car.engine}</span>
              </div>
            </div>

            {/* Detailed Spec List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div><span className="text-slate-500">Torque:</span> <span className="font-bold text-slate-900">{car.torque} Nm</span></div>
              <div><span className="text-slate-500">Transmission:</span> <span className="font-bold text-slate-900">{car.transmission}</span></div>
              <div><span className="text-slate-500">Seating:</span> <span className="font-bold text-slate-900">{car.seatingCapacity} Persons</span></div>
              <div><span className="text-slate-500">Boot Space:</span> <span className="font-bold text-slate-900">{car.bootSpace} Liters</span></div>
              <div><span className="text-slate-500">Ground Clearance:</span> <span className="font-bold text-slate-900">{car.groundClearance} mm</span></div>
              <div><span className="text-slate-500">Dimensions:</span> <span className="font-bold text-slate-900">{car.length}x{car.width}x{car.height} mm</span></div>
            </div>
          </div>

          {/* Features List */}
          {car.features && car.features.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Highlights & Equipment Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {car.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Advantages & Pros
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {(car.pros || ['Great fuel efficiency', '5-Star GNCAP rating', 'Strong resale demand']).map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" /> Possible Drawbacks
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {(car.cons || ['High demand leads to waiting periods', 'Firm suspension setup']).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price History Chart */}
          {priceHistory && priceHistory.pricePoints && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  Historical Ex-Showroom Price Trend
                </h3>
                <span className="text-xs text-cyan-600 font-bold">{priceHistory.percentChange} Change</span>
              </div>
              <div className="h-48 w-full bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory.pricePoints}>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} formatter={(v) => `₹${(v / 100000).toFixed(2)}L`} />
                    <Tooltip formatter={(v) => `₹${(v / 100000).toFixed(2)} Lakh`} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '11px', color: '#0f172a' }} />
                    <Line type="monotone" dataKey="price" stroke="#0891b2" strokeWidth={3} dot={{ fill: '#0891b2' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Ownership & Resale Estimate Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900">Estimated Ownership Health</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-2 font-medium">
                  <Wrench className="w-4 h-4 text-purple-600" /> Service Cost (1-Yr)
                </span>
                <span className="font-bold text-slate-900">₹{(car.serviceCost || 5000).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-2 font-medium">
                  <Shield className="w-4 h-4 text-blue-600" /> Insurance (1-Yr)
                </span>
                <span className="font-bold text-slate-900">₹{(car.insuranceCost || 25000).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-2 font-medium">
                  <RefreshCw className="w-4 h-4 text-emerald-600" /> 3-Yr Retained Value
                </span>
                <span className="font-bold text-emerald-600">{car.resaleValue || 70}%</span>
              </div>
            </div>

            <Link
              to="/calculator"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-blue-600 flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <Calculator className="w-4 h-4" /> Full 5-Year Ownership Breakdown
            </Link>
          </div>

          {/* User Reviews Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">Owner Reviews</h3>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 border border-amber-200 font-extrabold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {reviewsData.avgRating || 4.5} / 5 ({reviewsData.total})
              </div>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {reviewsData.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No reviews written yet. Be the first!</p>
              ) : (
                reviewsData.reviews.map((rev) => (
                  <div key={rev._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.user?.name || 'Verified Owner'}</span>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="font-semibold text-slate-800">{rev.title}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            {isAuthenticated ? (
              reviewSubmitted ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs text-center font-bold">
                  Thank you! Your review has been recorded.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900">Write Your Review</h4>
                  {reviewError && <p className="text-rose-600 text-[11px] font-semibold">{reviewError}</p>}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-900 font-bold"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Review Title (e.g. Great mileage & comfort)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />

                  <textarea
                    placeholder="Share your driving experience, maintenance costs, pros/cons..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows="2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                  >
                    Submit Review
                  </button>
                </form>
              )
            ) : (
              <p className="text-xs text-slate-500 text-center pt-2">
                <Link to="/login" className="text-blue-600 underline font-bold">Log in</Link> to write a review.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* Contact Seller Modal */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl relative text-slate-900">
            <button onClick={() => setEnquiryModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">Contact Seller / Dealer</h3>
            <p className="text-xs text-slate-500 mb-4">Send your contact inquiry for {car.name}</p>

            {enquirySent ? (
              <div className="p-6 text-center text-emerald-600 space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto" />
                <p className="font-bold">Enquiry Sent Successfully!</p>
                <p className="text-xs text-slate-500">The seller will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Your Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Message</label>
                  <textarea
                    placeholder="I am interested in buying this car. Please share availability and test drive booking details."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    required
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CarDetailsPage;
