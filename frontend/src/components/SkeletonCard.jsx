import React from 'react';

export default function SkeletonCard({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel p-6 rounded-xl animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-20 bg-white/5 rounded-full" />
            <div className="h-5 w-12 bg-white/5 rounded-full ml-auto" />
          </div>
          <div className="h-4 bg-white/5 rounded mb-2 w-full" />
          <div className="h-4 bg-white/5 rounded mb-2 w-4/5" />
          <div className="h-4 bg-white/5 rounded mb-6 w-3/5" />
          <div className="h-3 bg-white/5 rounded mb-1.5 w-full" />
          <div className="h-3 bg-white/5 rounded mb-1.5 w-full" />
          <div className="h-3 bg-white/5 rounded w-2/3" />
          <div className="h-8 bg-white/5 rounded-lg mt-5 w-full" />
        </div>
      ))}
    </>
  );
}
