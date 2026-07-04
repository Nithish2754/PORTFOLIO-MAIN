import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

export default function SectionIndicator() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.indexOf(entry.target.id);
            if (index !== -1) setActiveIdx(index);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Format index: 1 -> 01, etc. Hero is 00 or we can just say 01-05 for the actual sections.
  // The user requested 01/05 for sections. Let's adjust so 'hero' is 00 and contact is 05.
  const displayTotal = SECTIONS.length - 1; // 5 sections (excluding hero)
  const displayIdx = Math.min(Math.max(activeIdx, 1), displayTotal);
  
  const formattedCurrent = String(displayIdx).padStart(2, '0');
  const formattedTotal = String(displayTotal).padStart(2, '0');

  // Hide entirely on the hero section for a cleaner look
  if (activeIdx === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed bottom-8 left-8 z-40 hidden lg:flex flex-col gap-3 pointer-events-none"
      aria-hidden="true"
    >
      <div className="font-mono text-xs text-text-muted opacity-60 flex flex-col items-start gap-1">
        <span className="text-accent-cyan">nithish@portfolio:~$</span>
        <span>section {formattedCurrent}/{formattedTotal}</span>
      </div>
      
      <div className="flex gap-1.5 mt-2">
        {Array.from({ length: displayTotal }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i + 1 === displayIdx 
                ? 'w-4 bg-accent-cyan shadow-[0_0_8px_#2de2c760]' 
                : 'w-1 bg-border-dim'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
