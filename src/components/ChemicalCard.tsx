import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import type { Chemical } from '@/lib/chemistryEngine';

interface ChemicalCardProps {
  chemical: Chemical;
  onAdd: (chemical: Chemical) => void;
  counter?: number;
}

export const ChemicalCard = forwardRef<HTMLDivElement, ChemicalCardProps>(
  ({ chemical, onAdd, counter = 0 }, ref) => {
    const getTypeColor = (type: Chemical['type']) => {
      switch (type) {
        case 'metal': return 'bg-muted border-muted-foreground/20';
        case 'salt': return 'bg-primary/10 border-primary/30';
        case 'acid': return 'bg-destructive/10 border-destructive/30';
        case 'base': return 'bg-accent/10 border-accent/30';
        default: return 'bg-secondary border-secondary-foreground/20';
      }
    };

    const getTypeLabel = (type: Chemical['type']) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
      <motion.div
        ref={ref}
        onClick={() => onAdd(chemical)}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          chemical-card p-3 cursor-pointer
          ${getTypeColor(chemical.type)}
          select-none transition-shadow duration-200
          hover:shadow-chemical active:shadow-sm
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{chemical.name}</h3>
            <p className="text-formula text-muted-foreground mt-0.5">{chemical.formula}</p>
          </div>
          <div className="flex items-center gap-2">
            {counter > 0 && (
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {counter}
              </div>
            )}
            <div
              className="w-4 h-4 rounded-full border border-border shadow-inner flex-shrink-0"
              style={{ backgroundColor: chemical.color === 'transparent' ? '#E2E8F0' : chemical.color }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">
            {getTypeLabel(chemical.type)}
          </span>
          <span className="text-xs text-muted-foreground">
            {chemical.state}
          </span>
        </div>
      </motion.div>
    );
  }
);

ChemicalCard.displayName = 'ChemicalCard';
