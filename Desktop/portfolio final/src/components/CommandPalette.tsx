import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Action {
  id: string;
  label: string;
  category: 'Navigation' | 'Actions' | 'Projects';
  keywords: string[];
  perform: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => {
    setOpen((o) => !o);
    setQuery('');
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleOpen();
      }
      // Listen for global open event (from Nav button)
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    const handleCustomEvent = () => toggleOpen();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomEvent);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const openLink = (url: string) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const triggerChatbot = () => {
    setOpen(false);
    const btn = document.getElementById('chatbot-launcher');
    if (btn) btn.click();
  };

  const actions: Action[] = [
    { id: 'nav-about', label: 'Go to About', category: 'Navigation', keywords: ['about', 'bio', 'whoami'], perform: () => scrollTo('about') },
    { id: 'nav-skills', label: 'Go to Skills', category: 'Navigation', keywords: ['skills', 'tech', 'stack'], perform: () => scrollTo('skills') },
    { id: 'nav-exp', label: 'Go to Experience', category: 'Navigation', keywords: ['experience', 'work', 'internship'], perform: () => scrollTo('experience') },
    { id: 'nav-proj', label: 'Go to Projects', category: 'Navigation', keywords: ['projects', 'work', 'portfolio'], perform: () => scrollTo('projects') },
    { id: 'nav-contact', label: 'Go to Contact', category: 'Navigation', keywords: ['contact', 'email', 'hire'], perform: () => scrollTo('contact') },
    
    { id: 'act-resume', label: 'Download Resume', category: 'Actions', keywords: ['resume', 'cv', 'download'], perform: () => { setOpen(false); window.location.href = '/resume.pdf'; } },
    { id: 'act-github', label: 'Open GitHub Profile', category: 'Actions', keywords: ['github', 'code', 'repo'], perform: () => openLink('https://github.com/Nithish2754') },
    { id: 'act-linkedin', label: 'Open LinkedIn Profile', category: 'Actions', keywords: ['linkedin', 'social', 'network'], perform: () => openLink('https://linkedin.com/in/nithish-r') },
    { id: 'act-chat', label: 'Chat with AI Assistant', category: 'Actions', keywords: ['chat', 'ai', 'bot', 'gemini'], perform: triggerChatbot },

    { id: 'proj-civic', label: 'Project: CivicBridge', category: 'Projects', keywords: ['civicbridge', 'civic', 'voice'], perform: () => scrollTo('projects') },
    { id: 'proj-cyber', label: 'Project: CyberLens', category: 'Projects', keywords: ['cyberlens', 'cyber', 'security', 'phishing'], perform: () => scrollTo('projects') },
    { id: 'proj-dev', label: 'Project: DevLens', category: 'Projects', keywords: ['devlens', 'github', 'repo'], perform: () => scrollTo('projects') },
  ];

  // Simple fuzzy filter
  const filteredActions = query
    ? actions.filter((a) => {
        const search = query.toLowerCase();
        return a.label.toLowerCase().includes(search) || a.keywords.some((k) => k.includes(search));
      })
    : actions;

  // Group by category for display
  const grouped = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, Action[]>);

  const flatFilteredActions = Object.values(grouped).flat();

  useEffect(() => {
    setSelectedIndex(0); // Reset selection on query change
  }, [query]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % flatFilteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flatFilteredActions.length) % flatFilteredActions.length);
    } else if (e.key === 'Enter' && flatFilteredActions.length > 0) {
      e.preventDefault();
      flatFilteredActions[selectedIndex].perform();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            key="cmd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            key="cmd-modal"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-bg-surface border border-border-dim rounded-[var(--radius-lg)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(45,226,199,0.1)] overflow-hidden flex flex-col"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-3 border-b border-border-dim bg-bg-elevated">
              <span className="text-accent-cyan font-mono mr-3 opacity-70">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search commands..."
                className="flex-1 bg-transparent border-none text-text-primary text-base font-mono focus:outline-none placeholder:text-text-muted"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="text-xs text-text-dim font-mono ml-2 border border-border-dim rounded px-1.5 py-0.5">ESC</span>
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-2 scroll-smooth">
              {flatFilteredActions.length === 0 ? (
                <div className="py-10 text-center text-text-muted font-mono text-sm">
                  No results found for "{query}"
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-3 mb-1 mt-2 text-xs font-mono text-text-dim uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((action) => {
                      const isSelected = flatFilteredActions[selectedIndex]?.id === action.id;
                      return (
                        <button
                          key={action.id}
                          onClick={() => action.perform()}
                          onMouseEnter={() => setSelectedIndex(flatFilteredActions.indexOf(action))}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] transition-colors text-left group ${
                            isSelected ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-primary hover:bg-bg-elevated'
                          }`}
                        >
                          <span className="text-sm">{action.label}</span>
                          {isSelected && (
                            <span className="text-xs font-mono text-accent-cyan opacity-80 flex items-center gap-1">
                              Enter 
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
