import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { projects } from '../data/data';

function ProjectCard({ project, index, total }: { project: (typeof projects)[0]; index: number; total: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [7, -7]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-7, 7]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Logic to elegantly center uneven rows (specifically for 5 projects)
  // On desktop (lg), 6 columns total: first 3 span 2, last 2 span 3
  // On tablet (md), 2 columns total: last odd item spans 2 to center
  const isLastOddOnMd = total % 2 !== 0 && index === total - 1;
  const isBottomRowOnLg = total === 5 && (index === 3 || index === 4);

  const colSpanClasses = `
    col-span-1 sm:col-span-1
    ${isLastOddOnMd ? 'sm:col-span-2 lg:col-span-3' : 'sm:col-span-1 lg:col-span-2'}
    ${isBottomRowOnLg && 'lg:col-span-3'}
  `;

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: index * 0.08 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`card-glow p-4 sm:p-6 cursor-pointer group flex flex-col h-full ${colSpanClasses}`}
        onClick={() => setExpanded(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(true)}
        aria-label={`View details for ${project.title}`}
      >
        {/* Featured badge */}
        {project.featured && (
          <div className="mb-3">
            <span className="inline-block font-mono text-xs text-accent-amber border border-accent-amber/40 bg-accent-amber/10 rounded px-2 py-0.5">
              featured
            </span>
          </div>
        )}

        <h3 className="font-semibold text-base sm:text-lg text-text-primary mb-1 group-hover:text-accent-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-text-muted text-sm mb-4">{project.shortDesc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
          {project.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              className="tag-pill"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 + ti * 0.04 + 0.2 }}
            >
              [{tag}]
            </motion.span>
          ))}
        </div>

        {/* Arrow hint */}
        <div className="flex justify-end mt-4">
          <span className="text-text-dim text-xs font-mono group-hover:text-accent-cyan transition-colors">
            view details →
          </span>
        </div>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
              aria-hidden="true"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col rounded-lg"
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} details`}
            >
              <div className="card-glow p-4 sm:p-8 relative flex-1 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors p-1 z-10 bg-bg-surface/80 backdrop-blur-sm rounded-full"
                  aria-label="Close dialog"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {project.featured && (
                  <span className="inline-block font-mono text-xs text-accent-amber border border-accent-amber/40 bg-accent-amber/10 rounded px-2 py-0.5 mb-4 mt-2">
                    featured
                  </span>
                )}

                <h3 className="text-lg sm:text-2xl font-bold text-text-primary mb-1 pr-8">{project.title}</h3>
                <p className="text-accent-cyan text-xs sm:text-sm font-mono mb-4 sm:mb-6">{project.shortDesc}</p>

                {project.caseStudy ? (
                  <div className="space-y-4 sm:space-y-5 mb-8 text-sm sm:text-[15px]">
                    <div>
                      <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">Problem</h4>
                      <p className="text-text-muted leading-relaxed">{project.caseStudy.problem}</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">Approach</h4>
                      <p className="text-text-muted leading-relaxed">{project.caseStudy.approach}</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">My Role</h4>
                      <p className="text-text-muted leading-relaxed">{project.caseStudy.role}</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">Tech Stack</h4>
                      <p className="text-text-muted leading-relaxed">{project.caseStudy.techStack}</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">Outcome / Learnings</h4>
                      <p className="text-text-muted leading-relaxed">{project.caseStudy.outcome}</p>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3 mb-8">
                    {project.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-3">
                        <span className="text-accent-cyan mt-1.5 shrink-0 font-mono text-xs">▹</span>
                        <span className="text-text-muted text-[15px] leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-pill">[{tag}]</span>
                  ))}
                </div>

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-accent-cyan text-accent-cyan text-sm font-medium hover:bg-accent-cyan hover:text-bg-base transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.084-.73.084-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.76-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .321.218.694.824.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24" aria-label="Projects">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="terminal-prompt mb-2">nithish@portfolio:~$ cat projects/</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-14">
            Projects <span className="text-accent-cyan">I've Built</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} total={projects.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
