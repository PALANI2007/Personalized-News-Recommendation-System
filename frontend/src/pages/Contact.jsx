import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import {
  Mail, Github, Linkedin, Globe, MapPin, Send, CheckCircle2, AlertCircle
} from 'lucide-react';
import useSEO from '../utils/useSEO';
import { PAGE_META } from '../utils/constants';

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

// Clean functional class generator to prevent undefined issues
const getInputClass = (error) => 
  `w-full px-4 py-3 rounded-lg text-sm bg-slate-950/50 border ${error ? 'border-red-500/40 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'} text-slate-100 placeholder-slate-500 focus:outline-none transition-all`;

export default function Contact() {
  useSEO(PAGE_META.contact.title, PAGE_META.contact.description);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim() || form.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      // Auto-focus first error (accessibility)
      const firstErrorField = document.getElementById(Object.keys(errs)[0]);
      if (firstErrorField) firstErrorField.focus();
      return; 
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate send
    setSending(false);
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const socials = [
    { icon: <Github className="w-5 h-5" aria-hidden="true" />, label: 'GitHub', sub: 'View source code & repositories', href: 'https://github.com', color: 'hover:border-slate-400/30 hover:bg-slate-400/5 hover:text-white focus-visible:ring-slate-400' },
    { icon: <Linkedin className="w-5 h-5" aria-hidden="true" />, label: 'LinkedIn', sub: 'Connect professionally', href: 'https://linkedin.com', color: 'hover:border-blue-400/30 hover:bg-blue-500/5 hover:text-blue-300 focus-visible:ring-blue-400' },
    { icon: <Globe className="w-5 h-5" aria-hidden="true" />, label: 'Portfolio', sub: 'View more projects', href: '#', color: 'hover:border-indigo-400/30 hover:bg-indigo-500/5 hover:text-indigo-300 focus-visible:ring-indigo-400' },
    { icon: <Mail className="w-5 h-5" aria-hidden="true" />, label: 'Email', sub: 'student@university.edu', href: 'mailto:student@university.edu', color: 'hover:border-emerald-400/30 hover:bg-emerald-500/5 hover:text-emerald-300 focus-visible:ring-emerald-400' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      <div className="absolute top-20 right-10 w-80 h-80 radial-glow-purple blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-5xl mx-auto relative z-10">

        <PageHeader
          badge="Get In Touch"
          title="Contact &"
          highlight="Connect"
          subtitle="Have questions about the project, want to collaborate, or just want to connect? Reach out through any of the channels below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Contact info + socials */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card */}
            <section className="glass-panel p-6 rounded-xl space-y-5" aria-label="Project Information">
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">Project Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Project Type</p>
                    <p className="text-xs text-slate-500">Final Year B.Tech / M.Tech Capstone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Location</p>
                    <p className="text-xs text-slate-500">India 🇮🇳</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Email</p>
                    <p className="text-xs text-slate-500">student@university.edu</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Links */}
            <nav className="space-y-3" aria-label="Social connections">
              {socials.map((s, i) => (
                <motion.a 
                  key={i} 
                  href={s.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 p-4 glass-panel rounded-xl border border-white/5 text-slate-400 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${s.color}`}
                  aria-label={`Visit my ${s.label}`}
                >
                  <div className="shrink-0">{s.icon}</div>
                  <div>
                    <p className="text-xs font-bold">{s.label}</p>
                    <p className="text-[10px] text-slate-600">{s.sub}</p>
                  </div>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-7 rounded-xl">
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider mb-6">Send a Message</h3>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-14 text-center space-y-4"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9 text-emerald-400" aria-hidden="true" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-100">Message Sent!</h4>
                    <p className="text-sm text-slate-400 max-w-xs">Thank you for reaching out. This is a demo form — in a live deployment, this would send an email.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-2 px-5 py-2 text-xs font-bold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Your Name" id="name">
                        <input 
                          id="name" 
                          name="name" 
                          type="text" 
                          autoComplete="name"
                          value={form.name} 
                          onChange={handleChange}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          placeholder="John Doe" 
                          className={getInputClass(errors.name)} 
                        />
                        {errors.name && <p id="name-error" className="text-[10px] text-red-400 mt-1 flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.name}</p>}
                      </Field>
                      <Field label="Email Address" id="email">
                        <input 
                          id="email" 
                          name="email" 
                          type="email" 
                          autoComplete="email"
                          value={form.email} 
                          onChange={handleChange}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          placeholder="john@example.com" 
                          className={getInputClass(errors.email)} 
                        />
                        {errors.email && <p id="email-error" className="text-[10px] text-red-400 mt-1 flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.email}</p>}
                      </Field>
                    </div>
                    <Field label="Subject" id="subject">
                      <input 
                        id="subject" 
                        name="subject" 
                        type="text"
                        autoComplete="off" 
                        value={form.subject} 
                        onChange={handleChange}
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? "subject-error" : undefined}
                        placeholder="Project enquiry, collaboration..." 
                        className={getInputClass(errors.subject)} 
                      />
                      {errors.subject && <p id="subject-error" className="text-[10px] text-red-400 mt-1 flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.subject}</p>}
                    </Field>
                    <Field label="Message" id="message">
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        value={form.message} 
                        onChange={handleChange}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        placeholder="Your message here..." 
                        className={`${getInputClass(errors.message)} resize-none`} 
                      />
                      <div className="flex justify-between mt-1">
                        {errors.message ? <p id="message-error" className="text-[10px] text-red-400 flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.message}</p> : <span />}
                        <p className={`text-[10px] ${form.message.length < 20 ? 'text-slate-600' : 'text-emerald-500'}`} aria-live="polite">
                          {form.message.length} chars (min 20)
                        </p>
                      </div>
                    </Field>
                    <button type="submit" disabled={sending}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 font-bold text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
                      aria-label="Send Message"
                    >
                      {sending ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" aria-hidden="true" /> Send Message</>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-600 text-center">This is a demonstration form. No data is transmitted.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
