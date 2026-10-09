import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import HomePage from './components/HomePage';
import CarsPage from './components/CarsPage';
import CarDetailsPage from './components/CarDetailsPage';
import ComparePage from './components/ComparePage';
import AdvisorPage from './components/AdvisorPage';
import CalculatorPage from './components/CalculatorPage';
import UsedCarValuationPage from './components/UsedCarValuationPage';
import SellCarPage from './components/SellCarPage';
import DealersPage from './components/DealersPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

// User / Seller Pages
import UserDashboardPage from './components/UserDashboardPage';
import WishlistPage from './components/WishlistPage';
import MyListingsPage from './components/MyListingsPage';
import MyOrdersPage from './components/MyOrdersPage';
import MyEnquiriesPage from './components/MyEnquiriesPage';
import MyReviewsPage from './components/MyReviewsPage';
import ProfilePage from './components/ProfilePage';

// Admin Pages
import AdminDashboardPage from './components/AdminDashboardPage';
import AdminUsersPage from './components/AdminUsersPage';
import AdminCarsPage from './components/AdminCarsPage';
import AdminListingsPage from './components/AdminListingsPage';
import AdminReviewsPage from './components/AdminReviewsPage';
import AdminReportsPage from './components/AdminReportsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CompareProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cars" element={<CarsPage />} />
                  <Route path="/cars/:id" element={<CarDetailsPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/advisor" element={<AdvisorPage />} />
                  <Route path="/calculator" element={<CalculatorPage />} />
                  <Route path="/used-car-value" element={<UsedCarValuationPage />} />
                  <Route path="/sell" element={<SellCarPage />} />
                  <Route path="/dealers" element={<DealersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <ProtectedRoute>
                        <MyListingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <MyOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-enquiries"
                    element={
                      <ProtectedRoute>
                        <MyEnquiriesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-reviews"
                    element={
                      <ProtectedRoute>
                        <MyReviewsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminUsersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/cars"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminCarsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/listings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminListingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reviews"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminReviewsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminReportsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
