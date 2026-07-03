import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { recommendNews, searchNews } from '../utils/api';
import SkeletonCard from '../components/SkeletonCard';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { getCategoryBadgeClass, PAGE_META } from '../utils/constants';
import useSEO from '../utils/useSEO';
import {
  Sparkles, XCircle, Search, HelpCircle, BookOpen,
  ExternalLink, ChevronRight, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Circular similarity score ring
function SimilarityRing({ percent }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percent / 100) * circumference;
  const color = percent >= 70 ? '#10b981' : percent >= 40 ? '#6366f1' : '#64748b';

  return (
    <div className="relative w-14 h-14 shrink-0" aria-label={`Similarity score: ${Math.round(percent)} percent`}>
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <motion.circle
          cx="25" cy="25" r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white" aria-hidden="true">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

const SAMPLE_HEADLINES = [
  "Crude oil prices continue decline",
  "Manchester United cruise into Champions League",
  "Apple's New iMac Computer Is All Display",
  "OPEC Increases Oil Output",
  "Microsoft to make foray into online music (SiliconValley.com)",
];

export default function Recommendation() {
  useSEO(PAGE_META.recommendation.title, PAGE_META.recommendation.description);

  const location = useLocation();
  const [title, setTitle] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [queriedArticle, setQueriedArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [computationMs, setComputationMs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchRecommendations = useCallback(async (q) => {
    if (!q || !q.trim()) return;
    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    try {
      const r = await recommendNews(q);
      setQueriedArticle(r.data.queried_article);
      setRecommendations(r.data.recommendations);
      setComputationMs(r.data.computation_time_ms);
    } catch (err) {
      const msg = err.response?.status === 404
        ? 'Article not found. Please select from the suggestions or try a sample headline.'
        : 'Backend unreachable. Please ensure Flask is running.';
      setError(msg);
      setQueriedArticle(null);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // If navigated with a title
  useEffect(() => {
    if (location.state?.selectedTitle) {
      setTitle(location.state.selectedTitle);
      fetchRecommendations(location.state.selectedTitle);
    }
  }, [location.state, fetchRecommendations]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced auto-suggest
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (title.trim().length < 3) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await searchNews(title, 'All', 10);
        const unique = [...new Set((r.data?.results || []).map(x => x.Title))];
        setSuggestions(unique.slice(0, 8));
        setShowSuggestions(true);
      } catch { }
    }, 280);
    return () => clearTimeout(debounceRef.current);
  }, [title]);

  const handleSelect = (t) => {
    setTitle(t);
    fetchRecommendations(t);
  };

  const clearInput = () => {
    setTitle('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-20 left-10 w-96 h-96 radial-glow-indigo blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">

        <PageHeader
          badge="Recommendation Engine"
          title="News"
          highlight="Recommendations"
          subtitle="Type a headline to find the top 5 most similar articles using TF-IDF vectorization and Cosine Similarity scoring."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Input Panel */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl" ref={wrapperRef}>
            <label htmlFor="articleTitle" className="text-[10px] font-bold text-slate-500 mb-2.5 block uppercase tracking-widest">Article Headline</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="articleTitle"
                type="text"
                autoComplete="off"
                value={title}
                onChange={e => { setTitle(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchRecommendations(title);
                  }
                }}
                placeholder="Type to search headlines and auto-suggest..."
                className="w-full pl-10 pr-10 py-3 rounded-lg text-sm bg-slate-950/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all"
              />
              {title && (
                <button
                  type="button"
                  onClick={clearInput}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  aria-label="Clear input"
                >
                  <XCircle className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-white/10 rounded-xl overflow-hidden z-40 shadow-2xl max-h-64 overflow-y-auto"
                    role="listbox"
                    aria-label="Headline suggestions"
                  >
                    <div className="px-4 py-2 border-b border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suggestions</span>
                    </div>
                    {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        type="button" 
                        onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                        role="option"
                        aria-selected="false"
                        className="w-full text-left px-4 py-3 text-xs text-slate-300 hover:bg-indigo-600/15 hover:text-white border-b border-white/5 last:border-0 flex items-center gap-2 transition-colors group focus-visible:bg-white/10 focus-visible:outline-none"
                      >
                        <ChevronRight className="w-3 h-3 text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
                        <span className="truncate">{s}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[10px] text-slate-500" aria-live="polite">
                {suggestions.length > 0 && showSuggestions ? `${suggestions.length} suggestions found` : 'Type at least 3 characters to see suggestions'}
              </p>
              <button
                onClick={() => fetchRecommendations(title)}
                disabled={!title.trim() || loading}
                className="flex items-center gap-2 px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-indigo-500/25 disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
                aria-label="Get Recommendations"
              >
                Get Recommendations <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Quick Test Panel */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Quick Test
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Click any sample headline to instantly test the recommendation engine.</p>
            <div className="space-y-2">
              {SAMPLE_HEADLINES.map((h, i) => (
                <motion.button
                  key={i} whileHover={{ x: 3 }}
                  onClick={() => handleSelect(h)}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/25 text-[11px] text-slate-300 font-medium transition-all line-clamp-1 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  aria-label={`Test with sample: ${h}`}
                >
                  {h}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-4" aria-busy="true">
            <div className="glass-panel p-6 rounded-xl animate-pulse h-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard count={5} />
            </div>
          </div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-xl text-center flex flex-col items-center gap-3 border border-red-500/10" role="alert">
            <AlertCircle className="w-12 h-12 text-red-500/40" aria-hidden="true" />
            <p className="font-bold text-red-400">Query Failed</p>
            <p className="text-sm text-slate-400 max-w-md">{error}</p>
          </div>
        ) : recommendations.length > 0 && queriedArticle ? (
          <div className="space-y-8" aria-live="polite">
            {/* Queried article card */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-panel-glow p-6 md:p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-bl-lg uppercase" aria-hidden="true">
                Queried Article
              </div>
              {computationMs && (
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-semibold" aria-label={`Computation time: ${computationMs} milliseconds`}>
                  ⚡ {computationMs}ms
                </div>
              )}
              <div className="max-w-4xl space-y-3 pt-4">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border inline-block ${getCategoryBadgeClass(queriedArticle.Category)}`} aria-label={`Category: ${queriedArticle.Category}`}>
                  {queriedArticle.Category}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 leading-snug">{queriedArticle.Title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{queriedArticle.Description}</p>
              </div>
            </motion.div>

            {/* Recommendations */}
            <div className="border-t border-white/5 pt-8">
              <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                Top 5 Content-Similar Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {recommendations.map((article, idx) => (
                  <motion.div
                    key={idx}
                    role="listitem"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className="glass-panel p-6 rounded-xl flex flex-col gap-4 group hover:glass-panel-glow transition-all duration-300"
                  >
                    {/* Top row: score ring + category */}
                    <div className="flex items-center gap-3">
                      <SimilarityRing percent={article['Similarity Percent'] || Math.round(article['Similarity Score'] * 100)} />
                      <div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border inline-block mb-1 ${getCategoryBadgeClass(article.Category)}`}>
                          {article.Category}
                        </span>
                        <p className="text-[10px] text-slate-500 font-semibold" aria-label={`Rank ${idx + 1}`}>Rank #{idx + 1}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                        {article.Title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{article.Description}</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSelect(article.Title)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600/35 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label={`Find news similar to: ${article.Title}`}
                      >
                        <Sparkles className="w-3 h-3" aria-hidden="true" /> Find Similar
                      </button>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(article.Title)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label={`Open Google search for: ${article.Title}`}
                      >
                        <ExternalLink className="w-3 h-3" aria-hidden="true" /> Open
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<HelpCircle className="w-10 h-10 text-slate-600" aria-hidden="true" />}
            title="Recommendation Engine Idle"
            message="Enter a news article headline or click a quick test sample above to generate content-based recommendations."
          />
        )}
      </div>
    </div>
  );
}
