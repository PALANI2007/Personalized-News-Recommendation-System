import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoryBadgeClass } from '../utils/constants';

/**
 * NewsCard — displays a single news article.
 * Memoized to prevent unnecessary re-renders in grid lists.
 */
const NewsCard = memo(function NewsCard({ article, index = 0, onFindSimilar }) {
  const navigate = useNavigate();
  const { Title, Description, Category } = article;
  const similarity = article['Similarity Score'];

  const handleRecommendClick = () => {
    if (onFindSimilar) {
      onFindSimilar(Title);
    } else {
      navigate('/recommendation', { state: { selectedTitle: Title } });
    }
  };

  const badgeClass = getCategoryBadgeClass(Category);
  const truncatedTitle = typeof Title === 'string' ? Title.substring(0, 80) : Title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -5 }}
      className="glass-panel hover:glass-panel-glow p-6 rounded-xl flex flex-col justify-between group h-full relative overflow-hidden transition-all duration-300"
      aria-label={`News article: ${typeof Title === 'string' ? Title : 'Article'}`}
    >
      {/* Background glow orb — CSS only, no Framer overhead */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"
        aria-hidden="true"
      />

      <div>
        {/* Category badge + similarity score */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span
            className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border inline-block ${badgeClass}`}
            aria-label={`Category: ${Category}`}
          >
            {Category}
          </span>

          {similarity !== undefined && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20"
              aria-label={`Similarity score: ${Math.round(similarity * 100)} percent`}
            >
              <Sparkles className="w-3 h-3 animate-pulse" aria-hidden="true" />
              {Math.round(similarity * 100)}% match
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-3 leading-snug group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2">
          {Title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {Description}
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={handleRecommendClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
        aria-label={`Find news similar to: ${truncatedTitle}`}
      >
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        Find Similar News
      </button>
    </motion.article>
  );
});

export default NewsCard;
