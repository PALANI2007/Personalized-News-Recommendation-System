import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon, value, label, color = 'indigo', trend, index = 0 }) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };
  const ringColor = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-panel p-5 rounded-xl flex items-center gap-4 group hover:glass-panel-glow transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-10 blur-xl" style={{ background: 'currentColor' }} />
      <div className={`p-3 rounded-xl border ${ringColor} shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 truncate">{label}</p>
        <p className="text-xl font-extrabold text-slate-100 leading-none">{value}</p>
        {trend && <p className="text-[10px] text-emerald-400 mt-1 font-semibold">{trend}</p>}
      </div>
    </motion.div>
  );
}
