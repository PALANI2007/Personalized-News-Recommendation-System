import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, BrainCircuit, Sparkles, Search, BarChart3,
  Database, FileText, LayoutDashboard, ChevronDown,
  Cpu, Network, GitBranch, Zap, Target, BookOpen
} from 'lucide-react';
import useSEO from '../utils/useSEO';
import { PAGE_META } from '../utils/constants';

// ─── Typing Effect Hook ───────────────────────────────────────────────────────
function useTypingEffect(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout;
    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex(i => (i + 1) % words.length);
    }
    setDisplay(current.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return display;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    const step = numTarget / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, numTarget);
      setCount(current);
      if (current >= numTarget) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  // Make sure we output exactly "88.68" for float targets when finished
  const formatted = Number.isInteger(parseFloat(String(target).replace(/[^0-9.]/g, '')))
    ? Math.round(count).toLocaleString()
    : count.toFixed(2);

  return <span ref={ref}>{formatted}{suffix}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  useSEO(PAGE_META.home.title, PAGE_META.home.description);

  const typedText = useTypingEffect([
    'Recommendation System',
    'NLP Pipeline',
    'TF-IDF Engine',
    'Content Classifier',
    'ML Project',
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const stats = [
    { value: '7600', label: 'Dataset Records', suffix: '' },
    { value: '4', label: 'Categories', suffix: '' },
    { value: '88.68', label: 'Model Accuracy', suffix: '%' },
    { value: '15', label: 'Rec. Latency', suffix: 'ms' },
  ];

  const features = [
    { icon: <Search className="w-5 h-5 text-cyan-400" aria-hidden="true" />, title: 'Semantic Search', desc: 'Instantly query titles and descriptions across 7,600 pre-processed news stories with category filters.', path: '/search', color: 'cyan' },
    { icon: <Sparkles className="w-5 h-5 text-purple-400" aria-hidden="true" />, title: 'Similarity Recommendations', desc: 'Submit a headline to fetch the top 5 most content-similar articles using TF-IDF & Cosine Similarity.', path: '/recommendation', color: 'purple' },
    { icon: <LayoutDashboard className="w-5 h-5 text-indigo-400" aria-hidden="true" />, title: 'Interactive Dashboard', desc: 'Visualize model metrics, vocabulary statistics, and per-category F1 scores in real time.', path: '/dashboard', color: 'indigo' },
    { icon: <FileText className="w-5 h-5 text-emerald-400" aria-hidden="true" />, title: 'Model Reports', desc: 'Review confusion matrices, precision/recall charts, and download the full project PDF report.', path: '/reports', color: 'emerald' },
    { icon: <Database className="w-5 h-5 text-amber-400" aria-hidden="true" />, title: 'Dataset Analytics', desc: 'Explore dataset structure, preview records, analyze token distributions and category frequencies.', path: '/analytics', color: 'amber' },
    { icon: <BookOpen className="w-5 h-5 text-rose-400" aria-hidden="true" />, title: 'About the Project', desc: 'Deep-dive into TF-IDF math, Logistic Regression intuition, the ML pipeline, and the developer board.', path: '/about', color: 'rose' },
  ];

  const pipeline = [
    { step: '01', icon: <Database className="w-5 h-5" aria-hidden="true" />, title: 'Load Dataset', desc: '7,600 AG News records', color: 'indigo' },
    { step: '02', icon: <Zap className="w-5 h-5" aria-hidden="true" />, title: 'Clean Data', desc: 'Remove nulls, duplicates', color: 'purple' },
    { step: '03', icon: <GitBranch className="w-5 h-5" aria-hidden="true" />, title: 'Feature Eng', desc: 'Combine Title + Desc', color: 'cyan' },
    { step: '04', icon: <Cpu className="w-5 h-5" aria-hidden="true" />, title: 'Train Model', desc: 'Logistic Regression', color: 'blue' },
    { step: '05', icon: <Network className="w-5 h-5" aria-hidden="true" />, title: 'TF-IDF Matrix', desc: 'Vectorize corpus', color: 'emerald' },
    { step: '06', icon: <Target className="w-5 h-5" aria-hidden="true" />, title: 'Cosine Similarity', desc: 'Pairwise scores', color: 'amber' },
    { step: '07', icon: <Sparkles className="w-5 h-5" aria-hidden="true" />, title: 'Recommendation', desc: 'Top 5 articles', color: 'rose' },
  ];

  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25 shadow-indigo-500/10',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25 shadow-purple-500/10',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-cyan-500/10',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/25 shadow-blue-500/10',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-emerald-500/10',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-amber-500/10',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-rose-500/10',
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-grid-pattern">
      {/* CSS-only floating background blobs (improves performance over JS framer motion) */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-blob" aria-hidden="true" />
      <div className="absolute bottom-40 -right-20 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-600/6 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-4000" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">

        {/* ── Hero ── */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-8"
          aria-labelledby="hero-title"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Final Year ML Project · College Capstone</span>
          </motion.div>

          <motion.h1 id="hero-title" variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Personalized News<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {typedText}
              <span className="animate-pulse" aria-hidden="true">|</span>
            </span>
            <span className="sr-only">{typedText}</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A production-quality NLP recommendation engine leveraging <span className="text-indigo-300 font-semibold">TF-IDF vectorization</span> and <span className="text-purple-300 font-semibold">Cosine Similarity</span> for content-based filtering, paired with a <span className="text-cyan-300 font-semibold">Logistic Regression</span> classifier achieving <span className="text-emerald-400 font-bold">88.68% accuracy</span>.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/recommendation"
              className="group flex items-center gap-2.5 px-7 py-3.5 font-bold text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
            >
              Try Recommendations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/search"
              className="px-7 py-3.5 font-bold text-sm rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/8 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
            >
              Search Corpus
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold hover:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1"
            >
              How it works <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.section>

        {/* ── Stats Grid ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-24"
          aria-label="Project Statistics"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel p-6 rounded-xl text-center group hover:glass-panel-glow transition-all duration-300 cursor-default"
            >
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent mb-1.5">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── How It Works Pipeline ── */}
        <section id="how-it-works" className="mt-36" aria-labelledby="pipeline-title">
          <div className="text-center mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-600/15 text-indigo-400 border border-indigo-500/25">
              ML Pipeline
            </span>
            <h2 id="pipeline-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">A 7-step machine learning pipeline from raw data to personalised recommendations.</p>
          </div>

          <div className="relative">
            {/* Connecting line (hidden on mobile, visible lg) */}
            <div className="hidden lg:block absolute top-[52px] left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

            {/* Changed from 2 cols to 1 on tiny screens, 2 sm, 4 md, 7 lg to avoid orphan final element */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {pipeline.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`relative w-14 h-14 rounded-full border flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 shadow-md ${colorClasses[step.color]}`}>
                    {step.icon}
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-slate-900 border border-white/10 rounded-full w-5 h-5 flex items-center justify-center text-slate-400" aria-label={`Step ${step.step}`}>
                      {step.step}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-0.5">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-[150px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="mt-36" aria-labelledby="modules-title">
          <div className="text-center mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-600/15 text-purple-400 border border-purple-500/25">
              Modules
            </span>
            <h2 id="modules-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explore All Features</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">Six integrated modules covering search, recommendation, analytics, reports, dataset exploration, and project documentation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                whileHover={{ y: -6 }}
                className="glass-panel p-7 rounded-xl flex flex-col group hover:glass-panel-glow transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" style={{ background: `var(--tw-gradient-from)` }} aria-hidden="true" />
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colorClasses[feat.color]}`}>
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">{feat.desc}</p>
                <Link
                  to={feat.path}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/link w-max focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 -ml-1"
                  aria-label={`Open ${feat.title} module`}
                >
                  Open Module
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Content-Based Filtering Banner ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-36 glass-panel-glow p-8 md:p-14 rounded-2xl relative overflow-hidden"
          aria-labelledby="banner-title"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-2xl space-y-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400">Algorithmic Foundation</span>
            <h2 id="banner-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">Content-Based Filtering</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unlike collaborative filtering which requires user history, our engine evaluates raw textual similarity. Articles are converted into TF-IDF vector arrays where each dimension represents a vocabulary term's weighted importance. The multi-dimensional angle between vectors — <span className="text-indigo-300 font-semibold">Cosine Similarity</span> — determines how semantically similar two articles are.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/about" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 border border-indigo-500/25 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500">
                Learn Methodology <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link to="/reports" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 border border-white/10 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500">
                View Reports <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
