import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchNews, getCategories } from '../utils/api';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import {
  Search as SearchIcon, Filter, RefreshCw, XCircle,
  Clock, ChevronLeft, ChevronRight, ArrowUpDown, Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSEO from '../utils/useSEO';
import { PAGE_META } from '../utils/constants';

const RECENT_KEY = 'nrs_recent_searches';
const PAGE_SIZE = 12;

export default function Search() {
  useSEO(PAGE_META.search.title, PAGE_META.search.description);

  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [categories, setCategories] = useState(['All']);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Load categories
  useEffect(() => {
    async function loadCats() {
      try {
        const r = await getCategories();
        if (r.data?.categories) setCategories(['All', ...r.data.categories]);
      } catch {
        setCategories(['All', 'World', 'Sports', 'Business', 'Science & Technology']);
      }
    }
    loadCats();
  }, []);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      setRecentSearches(stored);
    } catch { }
  }, []);

  // Debounced search trigger (only update keyword if changed)
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setKeyword(prev => {
        if (prev !== inputValue) {
          setCurrentPage(1);
          return inputValue;
        }
        return prev;
      });
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  // Fetch when keyword/category/sort/page changes
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // The API now natively supports pagination and sorting
      const r = await searchNews(keyword, category, PAGE_SIZE, currentPage, sortBy);
      
      const allResults = r.data?.results || [];
      const total = r.data?.total_results || 0;
      const tPages = r.data?.total_pages || 1;
      
      setTotalResults(total);
      setTotalPages(tPages);
      setResults(allResults);
    } catch {
      setError('Failed to search. Please ensure the Flask backend is running.');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sortBy, currentPage]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  // Reset to page 1 on category or sort change
  useEffect(() => { setCurrentPage(1); }, [category, sortBy]);

  const saveRecent = (q) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(r => r !== q)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    saveRecent(inputValue);
    if (keyword !== inputValue) {
      setKeyword(inputValue);
      setCurrentPage(1);
    }
    setShowRecent(false);
  };

  const handleRecentClick = (q) => {
    setInputValue(q);
    if (keyword !== q) {
      setKeyword(q);
      setCurrentPage(1);
    }
    setShowRecent(false);
  };

  const clearSearch = () => {
    setInputValue('');
    setKeyword('');
    inputRef.current?.focus();
  };

  // Highlight keyword in text safely
  const highlightText = (text, kw) => {
    if (!kw || !text) return text;
    // Escape regex chars
    const safeKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${safeKw})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === kw.toLowerCase()
        ? <mark key={i} className="bg-indigo-500/30 text-indigo-200 rounded px-0.5 not-italic">{part}</mark>
        : part
    );
  };

  const enhancedResults = results.map(article => ({
    ...article,
    _highlightedTitle: highlightText(article.Title, keyword),
    _highlightedDesc: highlightText(article.Description, keyword),
  }));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-10 right-10 w-96 h-96 radial-glow-cyan blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        <PageHeader
          badge="Search Engine"
          title="Search News"
          highlight="Corpus"
          subtitle="Instantly search across 7,600 cleaned and ML-categorised news articles. Results update as you type."
        />

        {/* ── Search Bar ── */}
        <form onSubmit={handleSearch} className="glass-panel p-5 rounded-xl mb-8" role="search" aria-label="News search">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Keyword input with suggestions */}
            <div className="flex-1 relative w-full">
              <label htmlFor="searchInput" className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">Search Keyword</label>
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                <input
                  id="searchInput"
                  ref={inputRef}
                  type="search"
                  autoComplete="off"
                  value={inputValue}
                  onChange={e => { setInputValue(e.target.value); setShowRecent(true); }}
                  onFocus={() => setShowRecent(true)}
                  onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                  placeholder="Search headlines or descriptions..."
                  aria-describedby="results-count"
                  className="w-full pl-10 pr-10 py-3 rounded-lg text-sm bg-slate-950/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all"
                />
                {inputValue && (
                  <button 
                    type="button" 
                    onClick={clearSearch} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                    aria-label="Clear search input"
                  >
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}

                {/* Recent Searches Dropdown */}
                <AnimatePresence>
                  {showRecent && recentSearches.length > 0 && !inputValue && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30"
                      role="listbox"
                      aria-label="Recent searches"
                    >
                      <div className="px-4 py-2 border-b border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3" aria-hidden="true" /> Recent Searches
                        </span>
                      </div>
                      {recentSearches.map((q, i) => (
                        <button 
                          key={i} 
                          type="button" 
                          onMouseDown={() => handleRecentClick(q)}
                          role="option"
                          aria-selected="false"
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-2 transition-colors focus-visible:bg-white/10 focus-visible:outline-none"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" /> {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-52 shrink-0">
              <label htmlFor="categorySelect" className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">Category</label>
              <div className="relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                <select
                  id="categorySelect"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-slate-950/50 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-[#0f172a]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-44 shrink-0">
              <label htmlFor="sortSelect" className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest flex items-center justify-between">
                <span>Sort By</span>
              </label>
              <div className="relative">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-slate-950/50 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <option value="relevance" className="bg-[#0f172a]">Relevance</option>
                  <option value="category" className="bg-[#0f172a]">Category A–Z</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full lg:w-auto px-7 py-3 font-bold text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13] focus-visible:ring-indigo-500 shrink-0"
              aria-label="Submit search"
            >
              <SearchIcon className="w-4 h-4" aria-hidden="true" /> Search
            </button>
          </div>
        </form>

        {/* ── Results Meta ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {keyword && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 flex items-center gap-1.5">
                <SearchIcon className="w-3 h-3" aria-hidden="true" /> <span className="sr-only">Searching for</span> "{keyword}"
                <button 
                  onClick={clearSearch} 
                  className="ml-0.5 text-indigo-600 hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-0.5"
                  aria-label="Remove keyword filter"
                >
                  <XCircle className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            )}
            <span id="results-count" className="text-xs text-slate-500" aria-live="polite">
              {!loading ? (
                <>
                  {totalResults > 0 ? `${totalResults} articles found` : 'No results'}
                  {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
                </>
              ) : 'Searching...'}
            </span>
          </div>
          {error && (
            <button 
              onClick={fetchResults} 
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Retry search"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" /> Retry
            </button>
          )}
        </div>

        {/* ── Results Grid ── */}
        {error ? (
          <div className="glass-panel p-10 rounded-xl text-center text-red-400 flex flex-col items-center gap-3" role="alert">
            <XCircle className="w-12 h-12 text-red-500/30" aria-hidden="true" />
            <p className="font-bold">Backend Unreachable</p>
            <p className="text-sm text-slate-400 max-w-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            <SkeletonCard count={PAGE_SIZE > 6 ? 6 : PAGE_SIZE} />
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="w-10 h-10 text-slate-600" aria-hidden="true" />}
            title="No Articles Found"
            message={keyword ? `No results for "${keyword}". Try a different keyword or remove the category filter.` : 'Start typing to search news articles.'}
            action={keyword && (
              <button 
                onClick={clearSearch} 
                className="px-4 py-2 text-xs font-semibold bg-indigo-600/20 text-indigo-300 rounded-lg border border-indigo-500/25 hover:bg-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Clear Search
              </button>
            )}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${keyword}-${category}-${currentPage}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
            >
              {enhancedResults.map((article, idx) => (
                <div role="listitem" key={idx}>
                  <NewsCard
                    index={idx}
                    article={{
                      ...article,
                      Title: article._highlightedTitle || article.Title,
                      Description: article._highlightedDesc || article.Description,
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 sm:gap-3 mt-10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            
            {/* Show a sliding window of page buttons on mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  // Show current, first, last, and immediate neighbors
                  if (p === 1 || p === totalPages) return true;
                  if (p >= currentPage - 1 && p <= currentPage + 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  // Add ellipsis if gap
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="text-slate-500 px-1">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                          currentPage === page 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
