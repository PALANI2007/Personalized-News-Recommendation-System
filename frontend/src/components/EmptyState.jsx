import React from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export default function EmptyState({ icon, title = 'No Results Found', message = 'Try adjusting your search criteria.', action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel py-20 px-8 rounded-xl text-center flex flex-col items-center justify-center space-y-4 col-span-full"
    >
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
        {icon || <SearchX className="w-10 h-10 text-slate-600" />}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-300 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">{message}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </motion.div>
  );
}
