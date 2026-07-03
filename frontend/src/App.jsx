import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';

// ─── Lazy load all page components for code splitting ─────────
// Each page becomes its own JS chunk, reducing initial bundle size
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Recommendation = lazy(() => import('./pages/Recommendation'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const DatasetAnalytics = lazy(() => import('./pages/DatasetAnalytics'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ─── Page Loading Fallback ─────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" aria-live="polite" aria-label="Loading page">
      <Loader message="Loading page..." />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-[#070a13] text-slate-100">
        <Navbar />
        <main id="main-content" className="flex-grow" tabIndex={-1}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/analytics" element={<DatasetAnalytics />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Proper 404 page instead of silently falling back to Home */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
