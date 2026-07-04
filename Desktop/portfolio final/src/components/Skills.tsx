import { motion } from 'framer-motion';
import { skillGroups } from '../data/data';

export default function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-20 md:py-24" aria-label="Skills">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="terminal-prompt mb-2">nithish@portfolio:~$ ls skills/</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-14">
            Tech <span className="text-accent-cyan">Stack</span>
          </h2>
        </motion.div>

        <div className="space-y-10">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-xs text-text-dim uppercase tracking-widest whitespace-nowrap">
                  {group.category}
                </span>
                <div className="h-px flex-1 bg-border-dim" />
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    className="tag-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: gi * 0.1 + si * 0.04,
                      ease: 'backOut',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    [{skill}]
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
