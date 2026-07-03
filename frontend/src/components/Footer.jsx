import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Linkedin, Mail, BrainCircuit, Heart } from 'lucide-react';

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070a13] text-slate-400 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1: Logo & Info */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded bg-gradient-to-tr from-[#6366f1] to-[#a855f7]">
                <BrainCircuit className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold tracking-tight">NeuralNews</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              An advanced Personalized News Recommendation and Text Classification System leveraging Natural Language Processing and Machine Learning to curate user-specific content.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <nav aria-label="Footer Navigation">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/search" className="hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 -ml-1">Search News</NavLink>
              </li>
              <li>
                <NavLink to="/recommendation" className="hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 -ml-1">Recommendation</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className="hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 -ml-1">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/reports" className="hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 -ml-1">Model Reports</NavLink>
              </li>
            </ul>
          </nav>

          {/* Section 3: Connect */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 p-2 rounded-lg bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="GitHub Repository">
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 p-2 rounded-lg bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="LinkedIn Profile">
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="mailto:contact@student.com" className="hover:text-white transition-colors duration-200 p-2 rounded-lg bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Email Contact">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <span className="text-xs text-slate-600 block">
              College Final Year Project &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Designed & Developed by student research group. Powered by React, Flask, and Scikit-Learn.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-hidden="true" /> for Academic Excellence
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
