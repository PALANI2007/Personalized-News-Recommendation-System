import React, { useState, useEffect } from 'react';
import { getReports, getDownloadReportUrl } from '../utils/api';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import { FileDown, RefreshCw, XCircle, Grid3X3, Award, Info, Download, FileJson, FileSpreadsheet, Maximize2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import useSEO from '../utils/useSEO';
import { API_BASE_URL, PAGE_META } from '../utils/constants';

function ReportImage({ filename, title, caption }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const url = `${API_BASE_URL}/reports/images/${filename}`;

  return (
    <>
      <div className="glass-panel p-4 rounded-xl flex flex-col group">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-300">{title}</h4>
          <button 
            onClick={() => setLightbox(true)} 
            className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`View full screen ${title}`}
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
        <button 
          className="relative bg-slate-950/50 rounded-lg overflow-hidden flex items-center justify-center min-h-[180px] w-full focus-visible:ring-2 focus-visible:ring-indigo-500"
          onClick={() => !errored && setLightbox(true)}
          disabled={errored}
          aria-label={`Enlarge image: ${title}`}
        >
          {!loaded && !errored && (
            <div className="absolute inset-0 animate-pulse bg-white/5 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}
          {errored ? (
            <div className="text-center text-slate-500 p-4 text-xs">
              <XCircle className="w-6 h-6 mx-auto mb-1 text-slate-600" aria-hidden="true" />
              Image not available
            </div>
          ) : (
            <img src={url} alt={title} onLoad={() => setLoaded(true)} onError={() => setErrored(true)}
              className={`w-full h-auto object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </button>
        {caption && <p className="text-[10px] text-slate-500 mt-2 text-center">{caption}</p>}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Full screen image of ${title}`}
            onClick={() => setLightbox(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl max-h-screen w-full relative" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-white">{title}</p>
                <button 
                  onClick={() => setLightbox(false)} 
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Close lightbox"
                >
                  <XCircle className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <img src={url} alt={title} className="w-full h-auto rounded-xl shadow-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Reports() {
  useSEO(PAGE_META.reports.title, PAGE_META.reports.description);

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await getReports();
      setReportData(r.data);
    } catch {
      setError('Failed to load reports. Please ensure the Flask backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center" aria-live="polite"><Loader message="Loading evaluation reports..." /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4" role="alert">
      <div className="glass-panel p-8 rounded-xl text-center max-w-md space-y-4">
        <XCircle className="w-12 h-12 text-red-500/40 mx-auto" aria-hidden="true" />
        <p className="font-bold text-red-400">Load Failed</p>
        <p className="text-sm text-slate-400">{error}</p>
        <button 
          onClick={fetchData} 
          className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg px-4 py-2 text-slate-300 transition-all mx-auto focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Retry
        </button>
      </div>
    </div>
  );

  const { accuracy, algorithm, vectorizer, metrics, confusion_matrix } = reportData;

  const getIntensityClass = (value, total) => {
    const ratio = value / total;
    if (ratio > 0.8) return 'bg-indigo-600/80 text-white font-black border-indigo-400/30';
    if (ratio > 0.3) return 'bg-indigo-600/30 text-slate-100 font-semibold border-indigo-600/20';
    if (value > 0) return 'bg-white/5 text-slate-400 border-white/5';
    return 'bg-transparent text-slate-700 border-white/5';
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-20 left-10 w-96 h-96 radial-glow-purple blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header + Export Buttons */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10">
          <PageHeader
            badge="Model Evaluation"
            title="Reports &"
            highlight="Analysis"
            subtitle="Interactive confusion matrices, precision/recall breakdowns, and visual performance charts."
          />
          <div className="flex flex-wrap gap-3 lg:mb-10">
            <a 
              href={getDownloadReportUrl()} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
              aria-label="Download PDF Report"
            >
              <FileDown className="w-4 h-4" aria-hidden="true" /> PDF Report
            </a>
            <a 
              href={`${API_BASE_URL}/export/csv`} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/25 text-xs font-bold hover:bg-emerald-600/30 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
              aria-label="Export dataset as CSV"
            >
              <FileSpreadsheet className="w-4 h-4" aria-hidden="true" /> Export CSV
            </a>
            <a 
              href={`${API_BASE_URL}/export/json`} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/25 text-xs font-bold hover:bg-amber-600/30 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
              aria-label="Export dataset as JSON"
            >
              <FileJson className="w-4 h-4" aria-hidden="true" /> Export JSON
            </a>
          </div>
        </div>

        {/* Algorithm Summary */}
        <section aria-label="Model specifications" className="glass-panel p-6 rounded-xl mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Classifier</p>
              <p className="text-sm font-bold text-slate-200">{algorithm}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Grid3X3 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Features</p>
              <p className="text-sm font-bold text-slate-200">{vectorizer}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall Accuracy</p>
              <p className="text-lg font-black text-emerald-400">{accuracy}%</p>
            </div>
          </div>
        </section>

        {/* Report Images Grid */}
        <section aria-label="Generated visual reports" className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <ReportImage filename="confusion_matrix.png" title="Confusion Matrix" caption="Predicted vs actual labels on the 1,520 test records" />
          <ReportImage filename="accuracy_chart.png" title="Model Accuracy Chart" caption="Logistic Regression accuracy visualised" />
          <ReportImage filename="category_distribution.png" title="Category Distribution" caption="Bar chart of news class frequencies" />
          <ReportImage filename="category_pie_chart.png" title="Category Pie Chart" caption="Percentage breakdown of news categories" />
        </section>

        {/* Classification Metrics Table + Confusion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Metrics Table */}
          <section className="glass-panel p-6 rounded-xl" aria-labelledby="metrics-table-title">
            <h3 id="metrics-table-title" className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Classification Metrics
            </h3>
            <p className="text-xs text-slate-500 mb-5">Per-category Precision, Recall, and F1-Score (testing split).</p>
            <div className="overflow-x-auto rounded-lg border border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-widest">
                    <th scope="col" className="py-2.5 px-3 font-semibold">Category</th>
                    <th scope="col" className="py-2.5 px-3 text-center font-semibold">Precision</th>
                    <th scope="col" className="py-2.5 px-3 text-center font-semibold">Recall</th>
                    <th scope="col" className="py-2.5 px-3 text-center font-semibold">F1</th>
                    <th scope="col" className="py-2.5 px-3 text-center font-semibold">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {metrics.map((row, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-200">{row.category}</td>
                      <td className="py-3 px-3 text-center text-cyan-400 font-semibold">{(row.precision * 100).toFixed(0)}%</td>
                      <td className="py-3 px-3 text-center text-purple-400 font-semibold">{(row.recall * 100).toFixed(0)}%</td>
                      <td className="py-3 px-3 text-center text-emerald-400 font-semibold">{(row.f1_score * 100).toFixed(0)}%</td>
                      <td className="py-3 px-3 text-center text-slate-400">{row.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Confusion Matrix */}
          <section className="glass-panel p-6 rounded-xl" aria-labelledby="confusion-matrix-title">
            <h3 id="confusion-matrix-title" className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-purple-400" aria-hidden="true" /> Confusion Matrix Heatmap
            </h3>
            <p className="text-xs text-slate-500 mb-5">Rows = Actual, Columns = Predicted (test subset).</p>
            <div className="flex flex-col gap-2.5" role="table" aria-label="Interactive confusion matrix">
              <div className="grid grid-cols-5 text-center text-[9px] font-black text-slate-500 uppercase tracking-widest" role="row">
                <div role="columnheader"></div>
                <div role="columnheader">World</div>
                <div role="columnheader">Sports</div>
                <div role="columnheader">Business</div>
                <div role="columnheader">Sci/Tech</div>
              </div>
              {confusion_matrix.map((row, rIdx) => {
                const vals = [row.predicted_world, row.predicted_sports, row.predicted_business, row.predicted_science_tech];
                return (
                  <div key={rIdx} className="grid grid-cols-5 items-center gap-1.5" role="row">
                    <div className="text-[9px] font-bold text-slate-400 truncate pr-1" role="rowheader">{row.actual}</div>
                    {vals.map((val, cIdx) => (
                      <motion.div 
                        key={cIdx} 
                        whileHover={{ scale: 1.08 }}
                        role="cell"
                        aria-label={`Actual ${row.actual}, Predicted ${['World','Sports','Business','Sci/Tech'][cIdx]}: ${val}`}
                        className={`py-4 rounded-lg text-center text-xs font-bold border min-h-[44px] flex items-center justify-center transition-all cursor-default ${getIntensityClass(val, row.total)}`}
                        title={`${row.actual} → ${['World','Sports','Business','Sci/Tech'][cIdx]}: ${val}`}
                      >
                        {val}
                      </motion.div>
                    ))}
                  </div>
                );
              })}
              <p className="text-[9px] text-slate-600 text-center mt-2">Diagonal = Correct predictions · 1,520 test samples total</p>
            </div>
          </section>
        </div>

        {/* Precision vs Recall Chart */}
        <section className="glass-panel p-6 rounded-xl" aria-hidden="true">
          <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Precision vs Recall Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-6">Side-by-side comparison across all four news categories.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} stroke="#64748b" style={{ fontSize: 10 }} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} formatter={v => `${(v * 100).toFixed(0)}%`} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="precision" name="Precision" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" name="Recall" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1_score" name="F1-Score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </div>
  );
}
