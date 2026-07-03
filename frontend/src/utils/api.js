import axios from 'axios';

// Use production endpoint if deployed, else fallback to local Flask server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Core API Calls ───────────────────────────────────────────────────────────
export const getStatus = () => api.get('/');
export const getCategories = () => api.get('/categories');
export const getStatistics = () => api.get('/statistics');
export const searchNews = (keyword = '', category = 'All', limit = 50, page = 1, sort = 'relevance') =>
  api.get('/search', { params: { keyword, category, limit, page, sort } });
export const recommendNews = (title) => api.post('/recommend', { title });
export const getReports = () => api.get('/reports');

// ─── New Endpoints ────────────────────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard');
export const getDataset = (page = 1, limit = 10, sample = false) =>
  api.get('/dataset', { params: { page, limit, sample } });
export const getModelInfo = () => api.get('/model');

// ─── Download / Export URLs ───────────────────────────────────────────────────
export const getDownloadReportUrl = () => `${API_BASE_URL}/download-report`;
export const getExportCsvUrl = () => `${API_BASE_URL}/export/csv`;
export const getExportJsonUrl = () => `${API_BASE_URL}/export/json`;
export const getReportImageUrl = (filename) => `${API_BASE_URL}/reports/images/${filename}`;

export default api;
