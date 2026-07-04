import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, easing: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-28 relative" aria-label="About Nithish R">
      <div className="section-wrap">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section header */}
          <motion.p variants={fadeUp} className="terminal-prompt mb-2">
            nithish@portfolio:~$ whoami
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-14">
            About <span className="text-accent-cyan">Me</span>
          </motion.h2>

          <div className="grid md:grid-cols-5 gap-6 sm:gap-8 md:gap-12 items-start">
            {/* Left: Text block */}
            <motion.div variants={fadeUp} className="md:col-span-3 space-y-6">
              <div className="space-y-3 sm:space-y-4 text-text-muted text-sm sm:text-[15px] leading-relaxed">
                <div>
                  <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1">Who I am</h3>
                  <p>
                    CSE student specializing in Cyber Security at Sri Sairam Engineering College. I combine secure systems thinking with full-stack web development — building applications that are both user-friendly and security-conscious.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">What I build</h3>
                  <p>
                    Full-stack development across React/Tailwind, FastAPI/Node.js, and AWS. I focus on clean, maintainable code and intuitive UI/UX that doesn't get in the user's way.
                  </p>
                </div>

                <div>
                  <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-1.5">Currently seeking</h3>
                  <p>
                    Software Development Internship roles where I can build real products and apply my Cyber Security background to create more secure, accessible software.
                  </p>
                </div>
              </div>

              {/* Stat row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs text-text-dim pt-2">
                <span className="text-text-primary">8.74 CGPA</span>
                <span>·</span>
                <span className="text-text-primary">5+ Projects Built</span>
                <span>·</span>
                <span className="text-text-primary">2 Internships</span>
                <span>·</span>
                <span className="text-text-primary">2 Certifications</span>
              </div>

              {/* Available badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-amber bg-accent-amber/10 mt-2">
                <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
                <span className="font-mono text-xs text-accent-amber">
                  Available for internship · 2026
                </span>
              </div>
            </motion.div>

            {/* Right: Education card */}
            <motion.div variants={fadeUp} className="md:col-span-2">
              <div className="card-glow p-6 space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 5.25-3.75 9.75-9 11.25S3 18.75 3 13.5c0-.898.157-1.762.44-2.577L12 14z" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Education</span>
                </div>

                <div>
                  <p className="font-semibold text-text-primary leading-snug">
                    B.E. Computer Science &amp; Engineering
                  </p>
                  <p className="text-accent-cyan text-sm font-mono mt-0.5">(Cyber Security)</p>
                </div>

                <div className="space-y-1">
                  <p className="text-text-muted text-sm">Sri Sairam Engineering College</p>
                  <p className="text-text-dim text-sm font-mono">Chennai · 2024–2028</p>
                </div>

                <div className="border-t border-border-dim pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-accent-cyan">8.74</span>
                    <span className="text-text-muted text-sm font-mono">/10 CGPA</span>
                  </div>
                  <p className="text-text-dim text-xs font-mono mt-0.5">Up to Semester 3</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
