import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: '// 01 — ABOUT', href: '#about' },
  { label: '// 02 — SKILLS', href: '#skills' },
  { label: '// 03 — EXPERIENCE', href: '#experience' },
  { label: '// 04 — PROJECTS', href: '#projects' },
  { label: '// 05 — CONTACT', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/80 backdrop-blur-xl border-b border-border-dim'
          : 'bg-transparent'
      }`}
    >
      <div className="section-wrap flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-mono text-accent-cyan text-sm font-medium tracking-wider hover:opacity-80 transition-opacity"
          aria-label="Back to top"
        >
          nithish<span className="text-text-muted">@portfolio</span>
          <span className="text-text-dim">:~$</span>
        </button>

        {/* Desktop nav — wider gap for breathing room */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 items-center" role="navigation">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = active === sectionId;
              return (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className={`font-mono text-xs tracking-wide transition-all duration-200 relative pb-1 ${
                      isActive ? 'text-accent-cyan' : 'text-text-muted hover:text-text-primary'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                    {/* Active underline glow instead of dot */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent-cyan"
                        style={{ boxShadow: '0 0 8px #2de2c780, 0 0 16px #2de2c740' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <button
            onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-border-dim text-text-muted hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors bg-bg-surface font-mono text-xs"
            aria-label="Open command palette"
          >
            <span>Search</span>
            <kbd className="font-sans px-1.5 py-0.5 rounded bg-bg-elevated text-text-dim border border-border-dim shadow-sm flex items-center gap-0.5">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 h-12 w-12 items-center justify-center touch-none"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-all ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-bg-surface border-b border-border-dim"
          >
            <ul className="flex flex-col py-4 px-6 gap-4">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = active === sectionId;
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className={`font-mono text-xs w-full text-left transition-colors ${
                        isActive ? 'text-accent-cyan' : 'text-text-muted hover:text-accent-cyan'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
