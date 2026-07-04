import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import Nav from './components/Nav';
import BootSequence from './components/BootSequence';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import ScrollProgress from './components/ScrollProgress';
import SectionIndicator from './components/SectionIndicator';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import './index.css';

export default function App() {
  const [booted, setBooted] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!booted) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [booted]);

  return (
    <>
      <CustomCursor />
      <BootSequence onComplete={() => setBooted(true)} />

      <AnimatePresence>
        {booted && (
          <motion.div
            key="site-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <ScrollProgress />
            <SectionIndicator />
            <CommandPalette />
            
            <Nav />
            <main>
              <Hero />
              <About />
              <Skills />
              <Experience />
              <Projects />
              <Certifications />
              <Contact />
            </main>
            <Chatbot />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
