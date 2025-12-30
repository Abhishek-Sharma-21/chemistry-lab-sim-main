import { motion, AnimatePresence } from 'framer-motion';
import type { Chemical, ReactionResult } from '@/lib/chemistryEngine';
import { forwardRef, useMemo } from 'react';

interface BeakerProps {
  chemicals: Chemical[];
  reaction: ReactionResult | null;
  isActive?: boolean;
}

const Bubble = ({ delay, left }: { delay: number; left: number }) => (
  <motion.div
    initial={{ y: 0, opacity: 0.8, scale: 1 }}
    animate={{ y: -120, opacity: 0, scale: 0.3 }}
    transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
    className="absolute w-3 h-3 rounded-full bg-primary-foreground/60 backdrop-blur-sm"
    style={{ left: `${left}%`, bottom: '20%' }}
  />
);

export const Beaker = forwardRef<HTMLDivElement, BeakerProps>(
  ({ chemicals, reaction, isActive }, ref) => {
    const hasLiquid = chemicals.length > 0;
    const liquidColor = reaction?.liquidColor || (hasLiquid ? '#CBD5E1' : 'transparent');
    const hasPrecipitate = reaction?.precipitate;
    const hasGas = reaction?.gasProduced;

    const bubbles = useMemo(() => 
      hasGas ? [
        { delay: 0, left: 25 },
        { delay: 0.3, left: 45 },
        { delay: 0.6, left: 65 },
        { delay: 0.9, left: 35 },
        { delay: 1.2, left: 55 },
        { delay: 1.5, left: 75 },
      ] : [], 
    [hasGas]);

    return (
      <div ref={ref} className="relative w-64 h-80 mx-auto">
        {/* Drop zone indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 rounded-3xl border-2 border-dashed border-primary bg-primary/5 z-10"
            />
          )}
        </AnimatePresence>

        {/* Beaker SVG */}
        <svg viewBox="0 0 200 280" className="w-full h-full">
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={liquidColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={liquidColor} stopOpacity="0.9" />
            </linearGradient>
            <filter id="liquidGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Beaker body */}
          <path
            d="M 40 50 L 40 220 Q 40 250 70 250 L 130 250 Q 160 250 160 220 L 160 50"
            fill="url(#glassGradient)"
            stroke="hsl(200, 20%, 75%)"
            strokeWidth="3"
            className="beaker-glass"
          />

          {/* Beaker lip */}
          <path
            d="M 30 50 L 40 50 M 160 50 L 170 50"
            stroke="hsl(200, 20%, 75%)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Measurement lines */}
          {[80, 120, 160, 200].map((y, i) => (
            <line 
              key={y}
              x1="45" 
              y1={y} 
              x2={i % 2 === 0 ? 65 : 55} 
              y2={y} 
              stroke="hsl(200, 15%, 70%)" 
              strokeWidth="1"
              opacity="0.5"
            />
          ))}

          {/* Liquid */}
          <AnimatePresence>
            {hasLiquid && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.path
                  initial={{ d: "M 45 245 Q 45 245 100 245 Q 155 245 155 245 L 155 245 L 45 245 Z" }}
                  animate={{ 
                    d: reaction?.occurred 
                      ? "M 45 110 Q 45 245 45 245 Q 45 245 70 245 L 130 245 Q 155 245 155 245 Q 155 245 155 110 Q 130 115 100 110 Q 70 105 45 110 Z"
                      : "M 45 150 Q 45 245 45 245 Q 45 245 70 245 L 130 245 Q 155 245 155 245 Q 155 245 155 150 Q 130 155 100 150 Q 70 145 45 150 Z"
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  fill="url(#liquidGradient)"
                  filter="url(#liquidGlow)"
                />
                <motion.ellipse
                  cx="100"
                  cy={reaction?.occurred ? 110 : 150}
                  rx="50"
                  ry="5"
                  fill="rgba(255,255,255,0.3)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Precipitate layer */}
          <AnimatePresence>
            {hasPrecipitate && (
              <motion.g
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <path
                  d="M 47 230 Q 47 248 70 248 L 130 248 Q 153 248 153 230 Q 130 225 100 230 Q 70 235 47 230 Z"
                  fill={reaction?.precipitate?.color}
                  stroke={reaction?.precipitate?.color}
                  strokeWidth="1"
                />
                <circle cx="70" cy="238" r="3" fill="rgba(0,0,0,0.1)" />
                <circle cx="100" cy="242" r="4" fill="rgba(0,0,0,0.1)" />
                <circle cx="130" cy="237" r="3" fill="rgba(0,0,0,0.1)" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Bubbles overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble, i) => (
            <Bubble key={i} delay={bubble.delay} left={bubble.left} />
          ))}
        </div>

        {/* Chemical chips */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap gap-1 justify-center max-w-[90%]">
          <AnimatePresence>
            {chemicals.map((chem) => (
              <motion.span
                key={chem.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-xs px-2 py-0.5 rounded-full bg-card/90 text-card-foreground border border-border shadow-sm font-mono"
              >
                {chem.formula}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

Beaker.displayName = 'Beaker';
