import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ badge, title, subtitle, highlight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 space-y-3"
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-600/15 text-indigo-400 border border-indigo-500/25">
          {badge}
        </span>
      )}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        {title}
        {highlight && (
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> {highlight}</span>
        )}
      </h1>
      {subtitle && <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}
