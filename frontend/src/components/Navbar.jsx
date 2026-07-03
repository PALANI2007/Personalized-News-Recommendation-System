import React, { useState, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = memo(function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Recommend', path: '/recommendation' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Reports', path: '/reports' },
    { name: 'Dataset', path: '/analytics' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070a13]/85 backdrop-blur-md" aria-label="Main Navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            aria-label="NeuralNews Home"
          >
            <div className="p-2 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#a855f7] text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              NeuralNews
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5" role="menubar">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                role="menuitem"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`
                }
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all duration-300"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden border-b border-white/5 bg-[#070a13] overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1" role="menu">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`
                  }
                  aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export default Navbar;
