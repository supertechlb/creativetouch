import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FloorIndicatorProps {
  currentFloor: number;
  totalFloors: number;
  floorName: string;
}

const FloorIndicator = ({ currentFloor, totalFloors }: FloorIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    >
      {/* Minimal Elevator Panel */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-lg">
        {/* Up Arrow */}
        <motion.div
          animate={{ opacity: currentFloor < totalFloors ? 0.8 : 0.3 }}
          className="flex justify-center mb-2"
        >
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </motion.div>
        
        {/* Floor Number */}
        <div className="relative w-10 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentFloor}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-slate-700"
            >
              {currentFloor}
            </motion.span>
          </AnimatePresence>
        </div>
        
        {/* Down Arrow */}
        <motion.div
          animate={{ opacity: currentFloor > 1 ? 0.8 : 0.3 }}
          className="flex justify-center mt-2"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
        
        {/* Progress Dots */}
        <div className="flex flex-col items-center gap-1.5 mt-3 pt-3 border-t border-slate-200">
          {Array.from({ length: totalFloors }).map((_, index) => {
            const floorNum = totalFloors - index;
            return (
              <motion.div
                key={floorNum}
                animate={{
                  scale: floorNum === currentFloor ? 1.3 : 1,
                  backgroundColor: floorNum === currentFloor ? '#f97316' : '#e2e8f0',
                }}
                transition={{ duration: 0.2 }}
                className="w-2 h-2 rounded-full"
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FloorIndicator;
