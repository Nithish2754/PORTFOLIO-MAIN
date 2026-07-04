import { motion } from 'framer-motion';
import { certifications, achievements } from '../data/data';

export default function Certifications() {
  return (
    <section id="certifications" className="py-16 sm:py-20 md:py-24" aria-label="Certifications and achievements">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="terminal-prompt mb-2">nithish@portfolio:~$ cat achievements.log</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-14">
            Certs &amp; <span className="text-accent-cyan">Achievements</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary">Certifications</h3>
            </div>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="card-glow p-3 sm:p-4 flex items-center gap-3"
                >
                  <span className="text-accent-cyan font-mono text-xs sm:text-sm shrink-0">✓</span>
                  <span className="text-text-muted text-xs sm:text-sm">{cert}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary">Achievements</h3>
            </div>
            <div className="space-y-3">
              {achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="card-glow p-5 border-accent-amber/30"
                  style={{ borderColor: 'rgba(255, 184, 77, 0.25)', boxShadow: '0 0 20px rgba(255, 184, 77, 0.07)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" role="img" aria-label="Trophy">{ach.icon}</span>
                    <div>
                      <p className="font-semibold text-text-primary text-sm leading-snug mb-1">
                        {ach.title}
                      </p>
                      <p className="text-text-muted text-xs leading-relaxed">{ach.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
