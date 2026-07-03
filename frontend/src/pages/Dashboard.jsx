import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import {
  Newspaper, BarChart3, ShieldCheck, Layers, RefreshCw, XCircle,
  BookType, AlignLeft, Cpu, HardDrive, Database, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion } from 'framer-motion';
import useSEO from '../utils/useSEO';
import { PAGE_META, CHART_COLORS } from '../utils/constants';

export default function Dashboard() {
  useSEO(PAGE_META.dashboard.title, PAGE_META.dashboard.description);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.get('/dashboard');
      setData(r.data);
    } catch {
      setError('Failed to load dashboard. Please ensure the Flask backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#070a13]" aria-live="polite">
      <Loader message="Loading dashboard metrics..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#070a13]" role="alert">
      <div className="glass-panel p-8 rounded-xl text-center max-w-md space-y-4">
        <XCircle className="w-12 h-12 text-red-500/40 mx-auto" aria-hidden="true" />
        <p className="font-bold text-red-400">Load Failed</p>
        <p className="text-sm text-slate-400">{error}</p>
        <button 
          onClick={fetchData} 
          className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg px-4 py-2 text-slate-300 transition-all mx-auto focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Retry loading dashboard"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Retry
        </button>
      </div>
    </div>
  );

  const statCards = [
    { icon: <Newspaper className="w-5 h-5" aria-hidden="true" />, label: 'Total Articles', value: data.total_articles?.toLocaleString(), color: 'indigo' },
    { icon: <Layers className="w-5 h-5" aria-hidden="true" />, label: 'Categories', value: data.total_categories, color: 'purple' },
    { icon: <ShieldCheck className="w-5 h-5" aria-hidden="true" />, label: 'Model Accuracy', value: `${data.model_accuracy}%`, color: 'emerald', trend: '↑ vs 25% baseline' },
    { icon: <BookType className="w-5 h-5" aria-hidden="true" />, label: 'Vocabulary Size', value: data.vocabulary_size?.toLocaleString(), color: 'cyan' },
    { icon: <AlignLeft className="w-5 h-5" aria-hidden="true" />, label: 'Avg Description Length', value: `${data.avg_description_length} words`, color: 'amber' },
    { icon: <BarChart3 className="w-5 h-5" aria-hidden="true" />, label: 'TF-IDF Features', value: data.tfidf_features?.toLocaleString(), color: 'blue' },
    { icon: <HardDrive className="w-5 h-5" aria-hidden="true" />, label: 'Model Size', value: `${data.model_size_kb} KB`, color: 'violet' },
    { icon: <Database className="w-5 h-5" aria-hidden="true" />, label: 'Dataset Size', value: `${data.dataset_size_kb} KB`, color: 'rose' },
  ];

  const categoryChartData = Object.entries(data.category_distribution || {}).map(([name, value]) => ({ name, count: value }));

  const modelCompData = [
    { name: 'Logistic Regression', accuracy: data.model_accuracy },
    { name: 'Random Guessing', accuracy: 25.0 },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-20 right-10 w-96 h-96 radial-glow-indigo blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <PageHeader
            badge="ML Dashboard"
            title="System"
            highlight="Dashboard"
            subtitle="Real-time model metrics, vocabulary statistics, and category-level performance scores."
          />
          <button 
            onClick={fetchData} 
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg px-4 py-2 text-slate-400 hover:text-white transition-all shrink-0 mb-10 focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Refresh
          </button>
        </div>

        {/* ── 8 Stat Cards ── */}
        <section aria-label="Key metrics" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((s, i) => (
            <StatCard key={i} index={i} icon={s.icon} label={s.label} value={s.value} color={s.color} trend={s.trend} />
          ))}
        </section>

        {/* ── Charts Row 1 ── */}
        <section aria-label="Data distribution charts" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Distribution */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Category Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-6">Equal class balance ensures unbiased classifier training.</p>
            <div className="h-64 w-full" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          {/* Train/Test Split */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" aria-hidden="true" /> Train / Test Split
            </h3>
            <p className="text-xs text-slate-500 mb-6">80/20 stratified split for model validation.</p>
            <div className="h-64 w-full flex items-center justify-center gap-8">
              <div className="w-[55%] h-full" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.split_data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                      {(data.split_data || []).map((_, i) => <Cell key={i} fill={i === 0 ? '#6366f1' : '#06b6d4'} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3" role="list" aria-label="Train/test breakdown">
                {(data.split_data || []).map((item, i) => (
                  <div key={i} role="listitem" className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: i === 0 ? '#6366f1' : '#06b6d4' }} aria-hidden="true" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-300">{item.name}</p>
                      <p className="text-xs font-black text-slate-100">{item.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Charts Row 2 ── */}
        <section aria-label="Model performance charts" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model vs Baseline */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Accuracy vs Baseline
            </h3>
            <p className="text-xs text-slate-500 mb-6">Logistic Regression vs random guess (25% for 4 classes).</p>
            <div className="h-48 w-full" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelCompData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" style={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: 10 }} width={120} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} formatter={v => `${v}%`} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 11 }} />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={22}>
                    <Cell fill="#10b981" />
                    <Cell fill="#475569" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-Category Radar */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" aria-hidden="true" /> Per-Category F1 Scores
            </h3>
            <p className="text-xs text-slate-500 mb-6">Precision, Recall, and F1 across all four news categories.</p>
            <div className="h-48 w-full" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data.radar_data || []}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="category" stroke="#64748b" style={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" style={{ fontSize: 9 }} />
                  <Radar name="Precision" dataKey="precision" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                  <Radar name="Recall" dataKey="recall" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                  <Radar name="F1" dataKey="f1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
