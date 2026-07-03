import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PageHeader from '../components/PageHeader';
import {
  BrainCircuit, Database, Cpu, GitBranch, Target, Network,
  Sparkles, BookOpen, Github, Linkedin,
  CheckCircle2, Zap, Code2
} from 'lucide-react';
import { motion } from 'framer-motion';
import useSEO from '../utils/useSEO';
import { PAGE_META } from '../utils/constants';

// TF-IDF Formula Block
function FormulaBlock({ formula, label }) {
  return (
    <div className="glass-panel px-5 py-4 rounded-xl text-center" aria-label={`Formula for ${label}: ${formula}`}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2" aria-hidden="true">{label}</p>
      <p className="font-mono text-indigo-300 text-sm font-bold" aria-hidden="true">{formula}</p>
    </div>
  );
}

// Step Block
function PipelineStep({ number, icon, title, desc, details = [], color, isLast = false }) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex gap-5 group"
      role="listitem"
    >
      <div className="flex flex-col items-center shrink-0">
        <div 
          className={`w-10 h-10 rounded-full border flex items-center justify-center ${colorMap[color]}`}
          aria-label={`Step ${number}`}
        >
          {icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-white/20 to-transparent mt-2 mb-2" aria-hidden="true" />}
      </div>
      <div className={isLast ? "pb-2" : "pb-10"}>
        <div className="flex items-center gap-2 mb-1.5" aria-hidden="true">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Step {number}</span>
        </div>
        <h3 className="text-base font-bold text-slate-100 mb-1">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-3">{desc}</p>
        {details.length > 0 && (
          <ul className="space-y-1" role="list" aria-label={`Details for ${title}`}>
            {details.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400" role="listitem">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function About() {
  useSEO(PAGE_META.about.title, PAGE_META.about.description);

  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    api.get('/model').then(r => setModelInfo(r.data)).catch(() => { });
  }, []);

  const techStack = [
    { name: 'Python', icon: '🐍', desc: 'Backend scripting and ML pipeline' },
    { name: 'Flask', icon: '⚗️', desc: 'REST API server with CORS support' },
    { name: 'Scikit-Learn', icon: '🤖', desc: 'Logistic Regression classifier' },
    { name: 'TF-IDF', icon: '📊', desc: 'Feature extraction vectorizer' },
    { name: 'Pandas', icon: '🐼', desc: 'Dataset preprocessing' },
    { name: 'React 18', icon: '⚛️', desc: 'Frontend SPA with Vite' },
    { name: 'Tailwind CSS', icon: '🎨', desc: 'Utility-first design system' },
    { name: 'Recharts', icon: '📈', desc: 'Data visualization charts' },
  ];

  const modelSpecs = modelInfo ? [
    { label: 'Algorithm', value: modelInfo.algorithm },
    { label: 'Accuracy', value: `${modelInfo.accuracy}%` },
    { label: 'Classes', value: modelInfo.num_classes },
    { label: 'Vocabulary', value: modelInfo.vocabulary_size?.toLocaleString() },
    { label: 'TF-IDF Features', value: modelInfo.tfidf_features?.toLocaleString() },
    { label: 'Training Samples', value: modelInfo.training_samples?.toLocaleString() },
    { label: 'Testing Samples', value: modelInfo.testing_samples?.toLocaleString() },
    { label: 'Model Size', value: `${modelInfo.model_size_kb} KB` },
  ] : [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-20 left-10 w-80 h-80 radial-glow-indigo blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-40 right-10 w-80 h-80 radial-glow-purple blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-5xl mx-auto relative z-10">

        <PageHeader
          badge="About This Project"
          title="ML Architecture &"
          highlight="Methodology"
          subtitle="A deep dive into the machine learning pipeline, algorithms, and design decisions behind the Personalized News Recommendation System."
        />

        {/* TF-IDF Explanation */}
        <section className="glass-panel p-8 rounded-2xl mb-8" aria-labelledby="tfidf-title">
          <h2 id="tfidf-title" className="text-xl font-extrabold text-slate-100 mb-1 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" aria-hidden="true" /> TF-IDF Vectorization
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            TF-IDF (Term Frequency–Inverse Document Frequency) transforms raw text into numerical vectors where each dimension represents a word's importance. Frequently occurring words in all documents get penalized, ensuring distinctive terms carry more weight.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <FormulaBlock formula="TF(t, d) = count(t in d) / |d|" label="Term Frequency" />
            <FormulaBlock formula="IDF(t) = log(N / df(t))" label="Inverse Document Frequency" />
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-indigo-300">Result:</span> Each article becomes a high-dimensional numerical vector. Sports articles contain high TF-IDF scores for words like "goal", "match", "player". Technology articles score high for "software", "data", "AI".
            </p>
          </div>
        </section>

        {/* Cosine Similarity */}
        <section className="glass-panel p-8 rounded-2xl mb-8" aria-labelledby="cosine-title">
          <h2 id="cosine-title" className="text-xl font-extrabold text-slate-100 mb-1 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" aria-hidden="true" /> Cosine Similarity
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            After converting articles to TF-IDF vectors, Cosine Similarity measures the angle between two vectors in multi-dimensional space. A score of 1.0 means identical content; 0.0 means completely unrelated.
          </p>
          <FormulaBlock formula="cos(θ) = (A · B) / (||A|| × ||B||)" label="Cosine Similarity Formula" />
          <div className="mt-4 grid grid-cols-3 text-center text-xs gap-3">
            <div className="glass-panel p-3 rounded-lg" aria-label="Highly Similar score range">
              <p className="font-black text-emerald-400 text-lg" aria-hidden="true">~0.8+</p>
              <p className="text-slate-500">Highly Similar</p>
            </div>
            <div className="glass-panel p-3 rounded-lg" aria-label="Somewhat Similar score range">
              <p className="font-black text-amber-400 text-lg" aria-hidden="true">~0.4</p>
              <p className="text-slate-500">Somewhat Similar</p>
            </div>
            <div className="glass-panel p-3 rounded-lg" aria-label="Unrelated score range">
              <p className="font-black text-slate-500 text-lg" aria-hidden="true">~0.0</p>
              <p className="text-slate-500">Unrelated</p>
            </div>
          </div>
        </section>

        {/* Logistic Regression */}
        <section className="glass-panel p-8 rounded-2xl mb-8" aria-labelledby="logistic-title">
          <h2 id="logistic-title" className="text-xl font-extrabold text-slate-100 mb-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Logistic Regression Classifier
          </h2>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            A multi-class Logistic Regression model is trained on the TF-IDF vectors to predict the category of any article (World, Sports, Business, or Science &amp; Technology). Despite its simplicity, it achieves <span className="text-emerald-400 font-bold">88.68% accuracy</span> — demonstrating that clean feature engineering often outperforms complex models.
          </p>
          {modelSpecs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="list" aria-label="Model specifications">
              {modelSpecs.map((spec, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 text-center" role="listitem">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="text-sm font-black text-slate-100">{spec.value}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ML Pipeline */}
        <section className="mb-8" aria-labelledby="pipeline-title">
          <h2 id="pipeline-title" className="text-xl font-extrabold text-slate-100 mb-6 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" aria-hidden="true" /> End-to-End ML Pipeline
          </h2>
          <div className="glass-panel p-8 rounded-2xl" role="list" aria-label="Machine Learning Pipeline Steps">
            <PipelineStep number="1" icon={<Database className="w-4 h-4" aria-hidden="true" />} color="indigo" title="Load AG News Dataset"
              desc="Import 7,600 rows from the AG News corpus containing Title, Description, and Category columns."
              details={["CSV loaded with Pandas", "4 balanced categories", "~1,900 articles per class"]} />
            <PipelineStep number="2" icon={<Zap className="w-4 h-4" aria-hidden="true" />} color="purple" title="Data Cleaning & Preprocessing"
              desc="Handle nulls, duplicates, and build combined text feature from Title + Description."
              details={["Drop rows with null Title or Description", "Fill remaining nulls with empty string", "Concatenate Title + ' ' + Description"]} />
            <PipelineStep number="3" icon={<Cpu className="w-4 h-4" aria-hidden="true" />} color="cyan" title="TF-IDF Feature Extraction"
              desc="Fit TfidfVectorizer on the combined text column with English stop word removal."
              details={["TfidfVectorizer(stop_words='english')", "Produces sparse matrix of shape (7600, vocab_size)", "Serialized to tfidf_vectorizer.pkl"]} />
            <PipelineStep number="4" icon={<Target className="w-4 h-4" aria-hidden="true" />} color="emerald" title="Train Logistic Regression"
              desc="80/20 stratified split. Logistic Regression trained on TF-IDF vectors to classify categories."
              details={["LogisticRegression(max_iter=1000, random_state=42)", "Training set: 6,080 records", "Serialized to news_model.pkl"]} />
            <PipelineStep number="5" icon={<Network className="w-4 h-4" aria-hidden="true" />} color="blue" title="Cosine Similarity Matrix"
              desc="Pre-compute 7600×7600 cosine similarity matrix at server startup for sub-15ms query speed."
              details={["sklearn.metrics.pairwise.cosine_similarity", "Matrix cached in RAM as NumPy array", "O(1) lookup per recommendation query"]} />
            <PipelineStep number="6" icon={<Sparkles className="w-4 h-4" aria-hidden="true" />} color="rose" title="Recommendation API"
              desc="Flask POST /api/recommend accepts a headline, finds the closest match, returns top 5 similar articles."
              details={["Exact match → partial match fallback", "Results sorted by descending similarity score", "Computation time logged per request"]}
              isLast={true} />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="glass-panel p-8 rounded-2xl mb-8" aria-labelledby="tech-stack-title">
          <h2 id="tech-stack-title" className="text-xl font-extrabold text-slate-100 mb-6 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" aria-hidden="true" /> Technology Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="list">
            {techStack.map((t, i) => (
              <motion.div key={i} role="listitem" whileHover={{ y: -4 }} className="bg-white/5 rounded-xl p-4 text-center group hover:bg-indigo-600/10 border border-transparent hover:border-indigo-500/25 transition-all cursor-default">
                <div className="text-3xl mb-2" aria-hidden="true">{t.icon}</div>
                <p className="text-xs font-bold text-slate-200 mb-0.5">{t.name}</p>
                <p className="text-[10px] text-slate-500">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Card */}
        <section className="glass-panel-glow p-8 rounded-2xl" aria-label="About the developer">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-indigo-500/25" aria-hidden="true">
              👨‍💻
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Project Developer</p>
              <h3 className="text-xl font-extrabold text-slate-100 mb-1">Final Year Student</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Built as a Final Year Project demonstrating end-to-end machine learning application development — from raw dataset preprocessing through model training, API design, and modern web UI implementation.
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:text-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Visit GitHub repository">
                  <Github className="w-3.5 h-3.5" aria-hidden="true" /> GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/25 hover:bg-blue-600/25 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Visit LinkedIn profile">
                  <Linkedin className="w-3.5 h-3.5" aria-hidden="true" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
