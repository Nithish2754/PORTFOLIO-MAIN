import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true); // Default true, detect mouse later

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for the trailing dot
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device via matchMedia
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsTouch(false);
    } else {
      return; // Do nothing on touch devices
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6); // offset by half width (12px / 2)
      cursorY.set(e.clientY - 6);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      const isInteractive = target.closest('a, button, input, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', checkHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-accent-cyan pointer-events-none z-[9999] mix-blend-screen"
      style={{
        x: smoothX,
        y: smoothY,
        opacity: isVisible ? 1 : 0,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(45, 226, 199, 0.1)' : 'rgba(45, 226, 199, 1)',
        border: isHovering ? '1px solid rgba(45, 226, 199, 0.5)' : '0px solid rgba(45, 226, 199, 1)',
      }}
      transition={{ type: 'tween', duration: 0.15 }}
      aria-hidden="true"
    />
  );
}
