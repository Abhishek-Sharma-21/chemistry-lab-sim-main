import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChemicalCard } from './ChemicalCard';
import { Beaker } from './Beaker';
import { ReactionOutput } from './ReactionOutput';
import { CHEMICALS, predictReaction, type Chemical, type ReactionResult } from '@/lib/chemistryEngine';
import { RotateCcw, FlaskConical, BookOpen, Plus, ArrowRight, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ChemistryLab() {
  const [beakerChemicals, setBeakerChemicals] = useState<Chemical[]>([]);
  const [reaction, setReaction] = useState<ReactionResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleAddChemical = useCallback(async (chemical: Chemical) => {
    if (beakerChemicals.find(c => c.id === chemical.id)) {
      toast.info(`${chemical.name} is already in the beaker`);
      return;
    }

    const newChemicals = [...beakerChemicals, chemical];
    setBeakerChemicals(newChemicals);

    // Predict reaction
    const result = await predictReaction(newChemicals);
    setReaction(result);

    if (result.occurred) {
      toast.success(`${result.type.charAt(0).toUpperCase() + result.type.slice(1)} reaction occurred!`);
    } else {
      toast.info(`${chemical.name} added to beaker`);
    }
  }, [beakerChemicals]);

  const handleReset = () => {
    setBeakerChemicals([]);
    setReaction(null);
    toast.info('Beaker cleared');
  };

  const handleClearOne = async () => {
    if (beakerChemicals.length === 0) {
      toast.info('No chemicals to remove');
      return;
    }

    const lastChemical = beakerChemicals[beakerChemicals.length - 1];
    const newChemicals = beakerChemicals.slice(0, -1);
    setBeakerChemicals(newChemicals);

    // Predict reaction with remaining chemicals
    const result = await predictReaction(newChemicals);
    setReaction(result);

    toast.info(`${lastChemical.name} removed from beaker`);
  };

  // Filter chemicals based on search query
  const filteredChemicals = CHEMICALS.filter(chemical =>
    chemical.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chemical.formula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered chemicals by type
  const metalChemicals = filteredChemicals.filter(c => c.type === 'metal');
  const nonmetalChemicals = filteredChemicals.filter(c => c.type === 'nonmetal');
  const moleculeChemicals = filteredChemicals.filter(c => c.type === 'molecule');
  const saltChemicals = filteredChemicals.filter(c => c.type === 'salt');
  const acidChemicals = filteredChemicals.filter(c => c.type === 'acid');
  const baseChemicals = filteredChemicals.filter(c => c.type === 'base');

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Chemistry Lab</h1>
              <p className="text-xs text-muted-foreground">Interactive Reaction Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearOne}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear One
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,320px,1fr] gap-8 items-start">

          {/* Chemical Shelf - Left */}
          <div className="space-y-6 order-3 lg:order-1">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search chemicals by name or formula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>Click chemicals to add them to the beaker. Use elements (O, Na, C) for atoms or molecules (O₂, H₂, N₂) for diatomic forms.</span>
            </div>

            {/* Metals */}
            {metalChemicals.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Metals
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {metalChemicals.map((chemical) => (
                    <ChemicalCard
                      key={chemical.id}
                      chemical={chemical}
                      onAdd={handleAddChemical}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Non-Metals */}
            {nonmetalChemicals.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Non-Metals
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {nonmetalChemicals.map((chemical) => (
                    <ChemicalCard
                      key={chemical.id}
                      chemical={chemical}
                      onAdd={handleAddChemical}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Molecules */}
            {moleculeChemicals.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Molecules
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {moleculeChemicals.map((chemical) => (
                    <ChemicalCard
                      key={chemical.id}
                      chemical={chemical}
                      onAdd={handleAddChemical}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Salts */}
            {saltChemicals.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Salts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {saltChemicals.map((chemical) => (
                    <ChemicalCard
                      key={chemical.id}
                      chemical={chemical}
                      onAdd={handleAddChemical}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Acids & Bases */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {acidChemicals.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    Acids
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                    {acidChemicals.map((chemical) => (
                      <ChemicalCard
                        key={chemical.id}
                        chemical={chemical}
                        onAdd={handleAddChemical}
                      />
                    ))}
                  </div>
                </div>
              )}

              {baseChemicals.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Bases
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                    {baseChemicals.map((chemical) => (
                      <ChemicalCard
                        key={chemical.id}
                        chemical={chemical}
                        onAdd={handleAddChemical}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* No results message */}
            {filteredChemicals.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No chemicals found matching "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Beaker - Center */}
          <div className="flex flex-col items-center order-1 lg:order-2 lg:sticky lg:top-24">
            <Beaker
              chemicals={beakerChemicals}
              reaction={reaction}
            />

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {beakerChemicals.length === 0
                  ? 'Click chemicals to add'
                  : `${beakerChemicals.length} chemical${beakerChemicals.length > 1 ? 's' : ''} added`
                }
              </p>

              {/* Quick add hint */}
              <AnimatePresence>
                {beakerChemicals.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex items-center justify-center gap-2 text-xs text-primary"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Iron</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Copper Sulfate</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reaction Output - Right */}
          <div className="order-2 lg:sticky lg:top-24">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Reaction Analysis
            </h3>
            <ReactionOutput reaction={reaction} />
          </div>
        </div>
      </main>

      {/* Footer hint */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent py-4 pointer-events-none">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Try: Iron + Copper Sulfate • Zinc + Hydrochloric Acid • Sodium Hydroxide + Hydrochloric Acid
          </p>
        </div>
      </footer>
    </div>
  );
}
