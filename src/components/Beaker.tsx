import { motion, AnimatePresence } from 'framer-motion';
import type { Chemical, ReactionResult } from '@/lib/chemistryEngine';
import { forwardRef, useMemo } from 'react';

interface BeakerProps {
  chemicals: Chemical[];
  reaction: ReactionResult | null;
  isActive?: boolean;
}

// Helper function to get contrasting bubble color
const getBubbleColor = (liquidColor: string): string => {
  // Convert hex to RGB for brightness calculation
  const hex = liquidColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return white bubbles for dark liquids, dark bubbles for light liquids
  return brightness < 128 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
};

const Bubble = ({ delay, left, color }: { delay: number; left: number; color: string }) => (
  <motion.div
    initial={{ y: 0, opacity: 0.9, scale: 0.8 }}
    animate={{ y: -140, opacity: 0, scale: 0.2 }}
    transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
    className="absolute w-4 h-4 rounded-full shadow-lg"
    style={{
      left: `${left}%`,
      bottom: '15%',
      backgroundColor: color,
      boxShadow: `0 0 8px ${color.replace('rgba', 'rgb').replace(', 0.8)', ', 0.4)').replace(', 0.6)', ', 0.3)')}`,
    }}
  />
);

export const Beaker = forwardRef<HTMLDivElement, BeakerProps>(
  ({ chemicals, reaction, isActive }, ref) => {
    const hasLiquid = chemicals.length > 0;
    const liquidColor = reaction?.liquidColor || (hasLiquid ? '#CBD5E1' : 'transparent');

    // Determine reaction effects from existing properties
    const hasPrecipitate = reaction?.occurred && (
      reaction.type === 'precipitation' ||
      reaction.observations.some(obs => obs.toLowerCase().includes('precipitate'))
    );

    const hasGas = reaction?.occurred && (
      reaction.type === 'gas_formation' ||
      reaction.type === 'redox' ||
      reaction.observations.some(obs => obs.toLowerCase().includes('bubble') || obs.toLowerCase().includes('gas'))
    );

    const bubbleColor = useMemo(() => getBubbleColor(liquidColor), [liquidColor]);

    const bubbles = useMemo(() =>
      hasGas ? [
        { delay: 0, left: 20 },
        { delay: 0.4, left: 35 },
        { delay: 0.8, left: 50 },
        { delay: 1.2, left: 65 },
        { delay: 1.6, left: 80 },
        { delay: 2.0, left: 30 },
        { delay: 2.4, left: 55 },
        { delay: 2.8, left: 70 },
      ] : [],
      [hasGas]);

    return (
      <div ref={ref} className="relative w-72 h-96 mx-auto">
        {/* Enhanced drop zone indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 rounded-3xl border-3 border-dashed border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg z-10"
            />
          )}
        </AnimatePresence>

        {/* Enhanced Beaker SVG */}
        <svg viewBox="0 0 220 320" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
            </linearGradient>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={liquidColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={liquidColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={liquidColor} stopOpacity="1.0" />
            </linearGradient>
            <radialGradient id="liquidHighlight" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </radialGradient>
            <filter id="liquidGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glassShadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
            </filter>
          </defs>

          {/* Beaker body with enhanced styling */}
          <path
            d="M 50 60 L 50 260 Q 50 290 80 290 L 140 290 Q 170 290 170 260 L 170 60"
            fill="url(#glassGradient)"
            stroke="hsl(200, 15%, 70%)"
            strokeWidth="4"
            filter="url(#glassShadow)"
            className="beaker-glass"
          />

          {/* Beaker lip with better styling */}
          <path
            d="M 40 60 L 50 60 M 170 60 L 180 60"
            stroke="hsl(200, 20%, 75%)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Enhanced measurement lines */}
          {[90, 130, 170, 210, 250].map((y, i) => (
            <g key={y}>
              <line
                x1="55"
                y1={y}
                x2={i % 2 === 0 ? 75 : 65}
                y2={y}
                stroke="hsl(200, 10%, 65%)"
                strokeWidth="2"
                opacity="0.6"
              />
              <text
                x="45"
                y={y + 4}
                fontSize="10"
                fill="hsl(200, 10%, 50%)"
                textAnchor="end"
              >
                {(6 - i) * 50}ml
              </text>
            </g>
          ))}

          {/* Enhanced Liquid */}
          <AnimatePresence>
            {hasLiquid && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.path
                  initial={{ d: "M 55 285 Q 55 285 110 285 Q 165 285 165 285 L 165 285 L 55 285 Z" }}
                  animate={{
                    d: reaction?.occurred
                      ? "M 55 120 Q 55 285 55 285 Q 55 285 80 285 L 140 285 Q 165 285 165 285 Q 165 285 165 120 Q 140 125 110 120 Q 80 115 55 120 Z"
                      : "M 55 160 Q 55 285 55 285 Q 55 285 80 285 L 140 285 Q 165 285 165 285 Q 165 285 165 160 Q 140 165 110 160 Q 80 155 55 160 Z"
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  fill="url(#liquidGradient)"
                  filter="url(#liquidGlow)"
                />
                {/* Enhanced liquid surface highlight */}
                <motion.ellipse
                  cx="110"
                  cy={reaction?.occurred ? 120 : 160}
                  rx="55"
                  ry="8"
                  fill="url(#liquidHighlight)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
                {/* Additional surface sparkle */}
                <motion.circle
                  cx="85"
                  cy={reaction?.occurred ? 115 : 155}
                  r="3"
                  fill="rgba(255,255,255,0.6)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ delay: 1, duration: 2, repeat: Infinity }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Enhanced Precipitate layer */}
          <AnimatePresence>
            {hasPrecipitate && (
              <motion.g
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.0 }}
              >
                <path
                  d="M 57 270 Q 57 288 80 288 L 140 288 Q 163 288 163 270 Q 140 265 110 270 Q 80 275 57 270 Z"
                  fill="#F5F5DC"  // Default precipitate color (off-white)
                  stroke="#F5F5DC"
                  strokeWidth="2"
                  opacity="0.9"
                />
                {/* Precipitate particles */}
                <circle cx="75" cy="275" r="2" fill="#F5F5DC" opacity="0.7" />
                <circle cx="110" cy="280" r="3" fill="#F5F5DC" opacity="0.8" />
                <circle cx="135" cy="276" r="2" fill="#F5F5DC" opacity="0.6" />
                <circle cx="95" cy="278" r="1.5" fill="#F5F5DC" opacity="0.5" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Enhanced Bubbles overlay with dynamic colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          {bubbles.map((bubble, i) => (
            <Bubble key={i} delay={bubble.delay} left={bubble.left} color={bubbleColor} />
          ))}
        </div>

        {/* Enhanced Chemical chips */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 justify-center max-w-[95%]">
          <AnimatePresence>
            {chemicals.map((chem, index) => (
              <motion.span
                key={chem.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-card/95 to-card/90 text-card-foreground border border-border/50 shadow-lg backdrop-blur-sm font-mono font-medium"
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
                }}
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
