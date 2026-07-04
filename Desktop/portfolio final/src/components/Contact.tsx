import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  {
    id: 'contact-email',
    label: 'Email',
    value: 'nithishraju2754@gmail.com',
    href: 'mailto:nithishraju2754@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'contact-phone',
    label: 'Phone',
    value: '+91-6369343445',
    href: 'tel:+916369343445',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: 'contact-github',
    label: 'GitHub',
    value: 'github.com/Nithish2754',
    href: 'https://github.com/Nithish2754',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.084-.73.084-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.76-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .321.218.694.824.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: 'contact-linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/nithish-r',
    href: 'https://linkedin.com/in/nithish-r',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:nithishraju2754@gmail.com?subject=${subject}&body=${body}`);
    setStatus('sent');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 pb-20 sm:pb-24 md:pb-32" aria-label="Contact">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="terminal-prompt mb-2">nithish@portfolio:~$ contact --send</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Get In <span className="text-accent-cyan">Touch</span>
          </h2>
          <p className="text-text-muted mb-8 sm:mb-10 md:mb-14 max-w-xl text-sm sm:text-base">
            Open to software development internship opportunities and interesting projects. Let's
            build something together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="space-y-4"
          >
            {LINKS.map((link, i) => {
              const isCopyable = link.id === 'contact-email' || link.id === 'contact-phone';
              const [copied, setCopied] = useState(false);

              const handleClick = (e: React.MouseEvent) => {
                if (isCopyable) {
                  e.preventDefault();
                  navigator.clipboard.writeText(link.value);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }
              };

              return (
                <motion.a
                  key={link.id}
                  id={link.id}
                  href={link.href}
                  onClick={handleClick}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 card-glow group cursor-pointer"
                  aria-label={`${link.label}: ${link.value}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan group-hover:text-bg-base transition-all duration-200">
                      {link.icon}
                    </div>
                    <div>
                      <p className="font-mono text-xs text-text-dim uppercase tracking-wider">{link.label}</p>
                      <p className="text-text-muted text-sm group-hover:text-text-primary transition-colors">{link.value}</p>
                    </div>
                  </div>
                  {isCopyable && (
                    <div className="text-xs font-mono text-text-dim group-hover:text-accent-cyan transition-colors">
                      {copied ? 'Copied!' : 'Copy'}
                    </div>
                  )}
                </motion.a>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="card-glow p-6 space-y-4"
            aria-label="Contact form"
          >
            <div>
              <label htmlFor="contact-name" className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-1.5">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your name"
                className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-dim focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contact-email-input" className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="contact-email-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="your@email.com"
                className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-dim focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                placeholder="Let's build something..."
                className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-dim focus:outline-none focus:border-accent-cyan transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-accent-cyan text-bg-base font-semibold text-sm hover:opacity-90 hover:shadow-glow-cyan active:scale-95 transition-all duration-200"
            >
              {status === 'sent' ? '✓ Message queued!' : 'Send Message'}
            </button>
          </motion.form>
        </div>

        {/* Footer line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20 pt-8 border-t border-border-dim flex flex-col md:flex-row items-center justify-between gap-3 text-text-dim text-xs font-mono"
        >
          <span>© 2026 Nithish R. Built with React + Framer Motion.</span>
          <span className="text-accent-cyan opacity-50">nithish@portfolio:~$ _</span>
        </motion.div>
      </div>
    </section>
  );
}
