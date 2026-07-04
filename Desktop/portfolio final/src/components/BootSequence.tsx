import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  '> Initializing portfolio...',
  '> Loading modules: [projects] [skills] [experience]',
  '> Establishing secure connection...',
  '> Access granted. Welcome.',
];

interface Props {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    let lineIndex = 0;
    const addLine = () => {
      if (lineIndex < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[lineIndex]]);
        lineIndex++;
        setTimeout(addLine, lineIndex === 1 ? 250 : 300);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 400);
      }
    };
    addLine();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="boot-screen"
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="max-w-lg w-full px-8">
            {/* Terminal header dots */}
            <div className="flex gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-accent-red opacity-80" />
              <span className="w-3 h-3 rounded-full bg-accent-amber opacity-80" />
              <span className="w-3 h-3 rounded-full bg-accent-cyan opacity-80" />
            </div>

            <div className="space-y-2">
              {lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`font-mono text-sm ${
                    i === lines.length - 1 && lines.length === BOOT_LINES.length
                      ? 'text-accent-cyan'
                      : 'text-text-muted'
                  }`}
                >
                  {line}
                </motion.p>
              ))}
              {lines.length < BOOT_LINES.length && (
                <span className="cursor-blink" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
