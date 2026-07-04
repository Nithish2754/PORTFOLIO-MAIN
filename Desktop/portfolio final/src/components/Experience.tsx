import { motion } from 'framer-motion';
import { experience } from '../data/data';

export default function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-20 md:py-24" aria-label="Work experience">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="terminal-prompt mb-2">nithish@portfolio:~$ cat experience.log</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-14">
            Work <span className="text-accent-cyan">Experience</span>
          </h2>
        </motion.div>

        <div className="relative ml-4 sm:ml-6">
          {/* Timeline line */}
          <div className="timeline-line" />

          {experience.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-cyan shadow-glow-cyan-sm border-2 border-bg-base" />

              <div className="card-glow p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">{entry.role}</h3>
                    <p className="text-accent-cyan font-mono text-sm mt-0.5">{entry.org}</p>
                  </div>
                  <span className="font-mono text-xs text-text-dim border border-border-dim rounded px-3 py-1 whitespace-nowrap self-start md:self-auto">
                    {entry.period}
                  </span>
                </div>

                <ul className="space-y-1.5 sm:space-y-2">
                  {entry.bullets.map((bullet, bi) => (
                    <li key={bi} className="flex items-start gap-3">
                      <span className="text-accent-cyan mt-1.5 shrink-0 font-mono text-xs">▹</span>
                      <span className="text-text-muted text-sm leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
