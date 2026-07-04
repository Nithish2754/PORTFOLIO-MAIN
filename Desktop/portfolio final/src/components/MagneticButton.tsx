import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: React.ElementType;
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  id?: string;
  'aria-label'?: string;
  [key: string]: any;
}

export default function MagneticButton({
  children,
  className = '',
  as = 'button',
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    // Limit the displacement to max ~8px
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  useSpring(x, springConfig);
  useSpring(y, springConfig);

  const Comp = as as any;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <Comp className={className} {...props}>
        {children}
      </Comp>
    </motion.div>
  );
}
