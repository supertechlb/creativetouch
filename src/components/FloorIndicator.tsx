import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronUp, ChevronDown } from 'lucide-react';

interface FloorIndicatorProps {
  currentFloor: number;
  totalFloors: number;
  floorName: string;
}

const FloorIndicator = ({ currentFloor, totalFloors, floorName }: FloorIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      {/* Elevator Panel */}
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-elegant">
        {/* Floor Display */}
        <div className="relative mb-4">
          {/* Up Arrow */}
          <motion.div
            animate={{ opacity: currentFloor < totalFloors ? 1 : 0.3 }}
            className="flex justify-center mb-2"
          >
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          
          {/* Floor Number */}
          <div className="relative w-16 h-20 bg-background rounded-lg border-2 border-primary/30 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentFloor}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-display font-bold text-primary"
              >
                {currentFloor}
              </motion.span>
            </AnimatePresence>
            
            {/* LED Indicator */}
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          
          {/* Down Arrow */}
          <motion.div
            animate={{ opacity: currentFloor > 1 ? 1 : 0.3 }}
            className="flex justify-center mt-2"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
        
        {/* Floor Name */}
        <AnimatePresence mode="wait">
          <motion.div
            key={floorName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Floor
            </p>
            <p className="text-sm font-medium text-foreground max-w-[80px] leading-tight">
              {floorName}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Progress Dots - now 7 floors */}
        <div className="flex flex-col items-center gap-1.5 mt-4 pt-4 border-t border-border">
          {Array.from({ length: totalFloors }).map((_, index) => {
            const floorNum = totalFloors - index;
            return (
              <motion.div
                key={floorNum}
                animate={{
                  scale: floorNum === currentFloor ? 1.4 : 1,
                  backgroundColor: floorNum === currentFloor ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                }}
                transition={{ duration: 0.2 }}
                className="w-2 h-2 rounded-full"
              />
            );
          })}
        </div>
        
        {/* Building Icon */}
        <div className="flex justify-center mt-4 pt-4 border-t border-border">
          <Building2 className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

export default FloorIndicator;
