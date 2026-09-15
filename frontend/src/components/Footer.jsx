import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Cpu, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl text-slate-900">
                AutoSmart <span className="text-blue-600">AI</span>
              </span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Next-generation intelligent car marketplace and car comparison platform powered by smart metrics, EMI calculations, total ownership algorithms, and AI recommendations.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Dealers</span>
              <span className="flex items-center gap-1 font-medium"><Cpu className="w-4 h-4 text-blue-600" /> AI Valuation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs tracking-wider uppercase">Portal Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/cars" className="hover:text-blue-600 transition-colors">Browse Cars</Link></li>
              <li><Link to="/compare" className="hover:text-blue-600 transition-colors">Compare Cars</Link></li>
              <li><Link to="/advisor" className="hover:text-blue-600 transition-colors">AI Car Advisor</Link></li>
              <li><Link to="/calculator" className="hover:text-blue-600 transition-colors">EMI & Ownership Calculator</Link></li>
              <li><Link to="/used-car-value" className="hover:text-blue-600 transition-colors">Used Car Fair Price</Link></li>
              <li><Link to="/sell" className="hover:text-blue-600 transition-colors">Sell Your Car</Link></li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs tracking-wider uppercase">Popular Brands</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/cars?brand=Tata" className="hover:text-blue-600 transition-colors">Tata Motors</Link></li>
              <li><Link to="/cars?brand=Mahindra" className="hover:text-blue-600 transition-colors">Mahindra</Link></li>
              <li><Link to="/cars?brand=Maruti Suzuki" className="hover:text-blue-600 transition-colors">Maruti Suzuki</Link></li>
              <li><Link to="/cars?brand=Hyundai" className="hover:text-blue-600 transition-colors">Hyundai</Link></li>
              <li><Link to="/cars?brand=Toyota" className="hover:text-blue-600 transition-colors">Toyota</Link></li>
              <li><Link to="/cars?brand=BMW" className="hover:text-blue-600 transition-colors">BMW & Luxury</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-600" /> New Delhi & Pan India</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-600" /> support@autosmart.ai</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-600" /> 1800-SMART-CAR</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoSmart AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-800 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

