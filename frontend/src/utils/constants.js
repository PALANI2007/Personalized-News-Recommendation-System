/**
 * Shared constants across the application.
 * Single source of truth — avoids duplication across pages.
 */

// ─── Category Colors ────────────────────────────────────────────
export const CATEGORY_COLORS = {
  'sports':              { badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', bar: '#10b981' },
  'business':            { badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',         bar: '#3b82f6' },
  'world':               { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',      bar: '#f59e0b' },
  'science & technology':{ badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',   bar: '#a855f7' },
  'sci & tech':          { badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',   bar: '#a855f7' },
  'science & tech':      { badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',   bar: '#a855f7' },
};

export const getCategoryBadgeClass = (cat = '') => {
  const key = cat.toLowerCase();
  return CATEGORY_COLORS[key]?.badge || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
};

export const getCategoryBarColor = (cat = '') => {
  const key = cat.toLowerCase();
  return CATEGORY_COLORS[key]?.bar || '#64748b';
};

// ─── Chart Colors ─────────────────────────────────────────────────
export const CHART_COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#3b82f6'];

// ─── Model Statistics (static fallback) ─────────────────────────
export const STATIC_STATS = {
  accuracy: 88.68,
  totalRecords: 7600,
  totalCategories: 4,
  trainingSet: 6080,
  testingSet: 1520,
};

// ─── API Base URL ────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ─── Page Metadata for SEO ──────────────────────────────────────
export const PAGE_META = {
  home: {
    title: 'Home | Personalized News Recommendation System',
    description: 'A machine learning news recommendation engine using TF-IDF vectorization and Cosine Similarity to recommend the top 5 similar articles.',
  },
  search: {
    title: 'Search News | Personalized News Recommendation System',
    description: 'Search across 7,600 cleaned and ML-categorised news articles by keyword and category.',
  },
  recommendation: {
    title: 'Recommendations | Personalized News Recommendation System',
    description: 'Enter a news headline to get the top 5 most content-similar articles using TF-IDF and Cosine Similarity.',
  },
  dashboard: {
    title: 'Dashboard | Personalized News Recommendation System',
    description: 'Interactive ML dashboard showing model accuracy, vocabulary size, TF-IDF features, and category performance metrics.',
  },
  reports: {
    title: 'Model Reports | Personalized News Recommendation System',
    description: 'Confusion matrix, precision/recall metrics, and classification reports for the Logistic Regression classifier.',
  },
  analytics: {
    title: 'Dataset Analytics | Personalized News Recommendation System',
    description: 'Explore the AG News dataset structure, category distribution, and statistical summary.',
  },
  about: {
    title: 'About | Personalized News Recommendation System',
    description: 'Deep dive into TF-IDF, Cosine Similarity, Logistic Regression, and the end-to-end ML pipeline.',
  },
  contact: {
    title: 'Contact | Personalized News Recommendation System',
    description: 'Get in touch with the project developer for collaboration, feedback, or enquiries.',
  },
};
