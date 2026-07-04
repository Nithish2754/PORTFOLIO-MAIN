import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const PHRASES = ['Cyber Security Student', 'Full Stack Developer', 'AI Enthusiast'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, easing: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  // Robust typewriter — phases: typing → pausing → deleting → next phrase
  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing':
        if (displayText.length < phrase.length) {
          timeout = setTimeout(() => {
            setDisplayText(phrase.slice(0, displayText.length + 1));
          }, 65);
        } else {
          // Fully typed — pause before deleting
          timeout = setTimeout(() => setPhase('pausing'), 2200);
        }
        break;

      case 'pausing':
        setPhase('deleting');
        break;

      case 'deleting':
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, 35);
        } else {
          // Fully deleted — advance to next phrase, start typing
          setPhraseIdx((i) => (i + 1) % PHRASES.length);
          setPhase('typing');
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase, phraseIdx]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
      aria-label="Hero section"
    >
      {/* Radial accent glow — hero only */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, #2de2c70c 0%, transparent 70%)',
        }}
      />

      <div className="section-wrap relative z-10 pt-20 pb-12">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Prompt label */}
          <motion.p variants={fadeUp} className="terminal-prompt mb-3">
            nithish@portfolio:~$ whoami
          </motion.p>

          {/* Name — "R" gets an animated underline glow */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Nithish{' '}
            <span className="relative inline-block">
              <span
                style={{
                  background: 'linear-gradient(135deg, #2de2c7, #5bf5e0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                R
              </span>
              {/* Animated underline glow */}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #2de2c7, #2de2c700)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </span>
          </motion.h1>

          {/* Typewriter subheading — tightened spacing */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-1 mb-4 h-7 sm:h-8 md:h-9">
            <span className="text-lg sm:text-xl md:text-2xl font-medium text-text-primary whitespace-nowrap">
              {displayText}
            </span>
            <span className="cursor-blink" aria-hidden="true" />
          </motion.div>

          {/* Tagline — reduced margin to CTA */}
          <motion.p
            variants={fadeUp}
            className="text-text-muted text-base sm:text-lg md:text-xl max-w-xl mb-6 sm:mb-8 leading-relaxed"
          >
            Building secure, AI-powered software —{' '}
            <span className="text-accent-cyan">one project at a time.</span>
          </motion.p>

          {/* CTA buttons — consistent height/padding, primary filled + 2 outlined */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <MagneticButton
              as="a"
              href="/resume.pdf"
              download="resume.pdf"
              className="group inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-200
                bg-accent-cyan text-bg-base hover:brightness-110 hover:shadow-glow-cyan active:scale-[0.97]"
              aria-label="Download Nithish's resume"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resume
            </MagneticButton>

            <MagneticButton
              as="a"
              href="https://github.com/Nithish2754"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-200
                border border-border-dim text-text-primary hover:border-accent-cyan hover:text-accent-cyan hover:shadow-glow-cyan-sm active:scale-[0.97]"
              aria-label="View Nithish's GitHub profile"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.084-.73.084-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.76-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .321.218.694.824.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              View GitHub
            </MagneticButton>

            <MagneticButton
              as="button"
              onClick={() => {
                const btn = document.getElementById('chatbot-launcher');
                btn?.click();
              }}
              className="group inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-200
                border border-border-dim text-text-primary hover:border-accent-cyan hover:text-accent-cyan hover:shadow-glow-cyan-sm active:scale-[0.97]"
              aria-label="Open AI chatbot"
            >
              <span className="font-mono text-accent-cyan">&gt;_</span>
              Chat with my AI
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-dim"
          aria-hidden="true"
        >
          <span className="font-mono text-xs">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-0.5 h-8 bg-gradient-to-b from-accent-cyan to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
