import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import type { ReactionResult } from '@/lib/chemistryEngine';
import { Beaker, Flame, Snowflake, TestTube, Atom, Sparkles } from 'lucide-react';

interface ReactionOutputProps {
  reaction: ReactionResult | null;
}

export const ReactionOutput = forwardRef<HTMLDivElement, ReactionOutputProps>(
  ({ reaction }, ref) => {
    if (!reaction) {
      return (
        <div ref={ref} className="glass-effect rounded-2xl p-6 text-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <TestTube className="w-12 h-12 opacity-50" />
            <p className="text-sm">Click chemicals to add them to the beaker</p>
          </div>
        </div>
      );
    }

    const getTypeIcon = () => {
      switch (reaction.type) {
        case 'displacement': return <Atom className="w-5 h-5" />;
        case 'precipitation': return <Beaker className="w-5 h-5" />;
        case 'neutralization': return <Sparkles className="w-5 h-5" />;
        case 'photosynthesis': return <Sparkles className="w-5 h-5 text-green-500" />;
        case 'combustion': return <Flame className="w-5 h-5 text-orange-500" />;
        case 'decomposition': return <Atom className="w-5 h-5 text-purple-500" />;
        case 'synthesis': return <Atom className="w-5 h-5 text-blue-500" />;
        default: return <TestTube className="w-5 h-5" />;
      }
    };

    const getTypeLabel = () => {
      switch (reaction.type) {
        case 'displacement': return 'Displacement Reaction';
        case 'precipitation': return 'Precipitation Reaction';
        case 'neutralization': return 'Neutralization Reaction';
        case 'photosynthesis': return 'Photosynthesis';
        case 'combustion': return 'Combustion Reaction';
        case 'decomposition': return 'Decomposition Reaction';
        case 'synthesis': return 'Synthesis Reaction';
        default: return 'No Reaction';
      }
    };

    const getEnergyIcon = () => {
      switch (reaction.energyChange) {
        case 'exothermic': return <Flame className="w-4 h-4 text-destructive" />;
        case 'endothermic': return <Snowflake className="w-4 h-4 text-primary" />;
        default: return null;
      }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          ref={ref}
          key={reaction.equation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-effect rounded-2xl p-6 space-y-4"
        >
          {/* Reaction Type Badge */}
          <div className="flex items-center justify-between">
            <div className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              ${reaction.occurred
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {getTypeIcon()}
              {getTypeLabel()}
            </div>

            {reaction.energyChange !== 'neutral' && (
              <div className="flex items-center gap-1.5 text-sm">
                {getEnergyIcon()}
                <span className="capitalize text-muted-foreground">{reaction.energyChange}</span>
              </div>
            )}
          </div>

          {/* Chemical Equation */}
          {reaction.occurred && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Balanced Equation</p>
              <p className="text-lg font-mono font-semibold text-foreground">
                {reaction.equation}
              </p>
            </div>
          )}

          {/* Observations */}
          {reaction.observations.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Observations</p>
              <ul className="space-y-1.5">
                {reaction.observations.map((obs, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {obs}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Products */}
          {reaction.products.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Products:</span>
              {reaction.products.map((product, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-mono"
                >
                  {product}
                </span>
              ))}
            </div>
          )}

          {/* Explanation */}
          {reaction.explanation && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reaction.explanation}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }
);

ReactionOutput.displayName = 'ReactionOutput';
