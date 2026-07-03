import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import {
  Database, FileText, RefreshCw, XCircle, Shuffle,
  ChevronLeft, ChevronRight, AlignLeft, Tag, AlertCircle, Copy, MoveHorizontal
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import useSEO from '../utils/useSEO';
import { PAGE_META, CHART_COLORS, getCategoryBadgeClass } from '../utils/constants';

export default function DatasetAnalytics() {
  useSEO(PAGE_META.analytics.title, PAGE_META.analytics.description);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isSampling, setIsSampling] = useState(false);

  const fetchData = async (pageNum = 1, sample = false) => {
    setLoading(true);
    setError(null);
    setIsSampling(sample);
    try {
      const r = await api.get(`/dataset?page=${pageNum}&limit=10${sample ? '&sample=true' : ''}`);
      setData(r.data);
      setPage(pageNum);
    } catch {
      setError('Failed to load dataset. Ensure the Flask backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1, false); }, []);

  const categoryChartData = data
    ? Object.entries(data.category_counts || {}).map(([name, value]) => ({ name, count: value }))
    : [];

  const statCards = data ? [
    { icon: <Database className="w-5 h-5" aria-hidden="true" />, label: 'Total Records', value: data.total_records?.toLocaleString(), color: 'indigo' },
    { icon: <Tag className="w-5 h-5" aria-hidden="true" />, label: 'Categories', value: data.total_categories, color: 'purple' },
    { icon: <AlertCircle className="w-5 h-5" aria-hidden="true" />, label: 'Missing Values', value: data.missing_values, color: data.missing_values > 0 ? 'rose' : 'emerald' },
    { icon: <Copy className="w-5 h-5" aria-hidden="true" />, label: 'Duplicates', value: data.duplicate_records, color: data.duplicate_records > 0 ? 'amber' : 'emerald' },
    { icon: <AlignLeft className="w-5 h-5" aria-hidden="true" />, label: 'Avg Word Count', value: data.word_count_stats?.avg, color: 'cyan' },
    { icon: <AlignLeft className="w-5 h-5" aria-hidden="true" />, label: 'Max Word Count', value: data.word_count_stats?.max, color: 'blue' },
  ] : [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-20 right-10 w-96 h-96 radial-glow-cyan blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <PageHeader
            badge="Dataset Explorer"
            title="Dataset"
            highlight="Analytics"
            subtitle="Explore the structure, statistics, and distribution of the 7,600-record AG News dataset."
          />
          <div className="flex gap-3 mb-10">
            <button 
              onClick={() => fetchData(page, true)}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-purple-600/15 text-purple-300 border border-purple-500/25 hover:bg-purple-600/25 transition-all focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <Shuffle className="w-3.5 h-3.5" aria-hidden="true" /> Random Sample
            </button>
            <button 
              onClick={() => fetchData(1, false)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Refresh dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24" aria-live="polite"><Loader message="Loading dataset..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-xl text-center space-y-3" role="alert">
            <XCircle className="w-12 h-12 text-red-500/40 mx-auto" aria-hidden="true" />
            <p className="font-bold text-red-400">Load Failed</p>
            <p className="text-sm text-slate-400">{error}</p>
            <button 
              onClick={() => fetchData(1, false)} 
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg px-4 py-2 text-slate-300 transition-all mx-auto focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Retry
            </button>
          </div>
        ) : (
          <>
            {/* ── Stat Cards ── */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10" aria-label="Dataset Statistics">
              {statCards.map((s, i) => (
                <StatCard key={i} index={i} icon={s.icon} label={s.label} value={s.value} color={s.color} />
              ))}
            </section>

            {/* ── Charts + Summary ── */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10" aria-label="Category Distribution Charts">
              {/* Category Bar Chart */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Category Distribution
                </h3>
                <p className="text-xs text-slate-500 mb-5">Number of records per news category.</p>
                <div className="h-52 w-full" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" style={{ fontSize: 10 }} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 11 }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {categoryChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category breakdown with % bars */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" aria-hidden="true" /> Category Breakdown
                </h3>
                <p className="text-xs text-slate-500 mb-5">Percentage share of each news category.</p>
                <div className="space-y-4 mt-2" role="list">
                  {categoryChartData.map((cat, i) => {
                    const pct = data ? ((cat.count / data.total_records) * 100).toFixed(1) : 0;
                    return (
                      <div key={i} role="listitem" aria-label={`${cat.name}: ${pct} percent`}>
                        <div className="flex justify-between text-xs mb-1.5" aria-hidden="true">
                          <span className="font-semibold text-slate-300">{cat.name}</span>
                          <span className="font-bold" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>
                            {cat.count.toLocaleString()} · {pct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden" aria-hidden="true">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── Dataset Preview Table ── */}
            <section className="glass-panel p-6 rounded-xl" aria-labelledby="dataset-preview-title">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 id="dataset-preview-title" className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                    {isSampling ? 'Random Sample' : 'Dataset Preview'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5" aria-live="polite">
                    {isSampling ? '5 randomly sampled records from the dataset.' : `Showing rows ${((page - 1) * 10) + 1}–${Math.min(page * 10, data.total_records)} of ${data.total_records?.toLocaleString()}`}
                  </p>
                </div>
                {!isSampling && data.total_pages > 1 && (
                  <nav className="flex items-center gap-2" aria-label="Dataset table pagination">
                    <button 
                      onClick={() => fetchData(Math.max(1, page - 1), false)} 
                      disabled={page === 1}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="text-xs text-slate-500 px-1 font-medium">Page {page} of {data.total_pages}</span>
                    <button 
                      onClick={() => fetchData(Math.min(data.total_pages, page + 1), false)} 
                      disabled={page === data.total_pages}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </div>

              {/* Mobile scroll indicator */}
              <div className="md:hidden flex items-center gap-1.5 text-[10px] text-slate-500 mb-2 font-medium tracking-wide">
                <MoveHorizontal className="w-3 h-3" /> Scroll horizontally to view full table
              </div>

              <div className="overflow-x-auto rounded-lg border border-white/5">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-widest">
                      <th scope="col" className="py-3 px-4 text-[10px] w-8">#</th>
                      <th scope="col" className="py-3 px-4 text-[10px]">Title</th>
                      <th scope="col" className="py-3 px-4 text-[10px]">Description</th>
                      <th scope="col" className="py-3 px-4 text-[10px] text-center">Category</th>
                    </tr>
                  </thead>
                  <AnimatePresence mode="wait">
                    <motion.tbody key={page + String(isSampling)}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="divide-y divide-white/5">
                      {(data.preview || []).map((row, i) => {
                        return (
                          <tr key={i} className="hover:bg-white/3 transition-colors group">
                            <td className="py-3 px-4 text-slate-500 font-bold">{(page - 1) * 10 + i + 1}</td>
                            <td className="py-3 px-4 text-slate-200 font-semibold max-w-xs">
                              <span className="line-clamp-2">{row.Title}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 max-w-sm">
                              <span className="line-clamp-2">{row.Description}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded border inline-block whitespace-nowrap ${getCategoryBadgeClass(row.Category)}`}>
                                {row.Category}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </motion.tbody>
                  </AnimatePresence>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
