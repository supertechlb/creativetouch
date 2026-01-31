import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Building2, ChevronUp, ChevronDown } from 'lucide-react';
import HeroFloor from './floors/HeroFloor';
import LivingRoomFloor from './floors/LivingRoomFloor';
import VillaGardenFloor from './floors/VillaGardenFloor';
import TowerContactFloor from './floors/TowerContactFloor';

// Floor configuration
const floors = [
  { id: 'hero', name: 'Terrace', number: 4 },
  { id: 'services', name: 'Living Room', number: 3 },
  { id: 'studio', name: 'Villa Garden', number: 2 },
  { id: 'contact', name: 'Tower Lobby', number: 1 },
];

// Elevator indicator component
const ElevatorIndicator = ({ 
  currentFloor, 
  floorName 
}: { 
  currentFloor: number; 
  floorName: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl">
        {/* Floor Display */}
        <div className="relative mb-4">
          <motion.div
            animate={{ opacity: currentFloor < 4 ? 1 : 0.3 }}
            className="flex justify-center mb-2"
          >
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          
          <div className="relative w-16 h-20 bg-background rounded-xl border-2 border-primary/30 flex items-center justify-center overflow-hidden">
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
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
            />
          </div>
          
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
        
        {/* Progress Dots */}
        <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-border">
          {floors.map((floor) => (
            <motion.div
              key={floor.number}
              animate={{
                scale: floor.number === currentFloor ? 1.5 : 1,
                backgroundColor: floor.number === currentFloor 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--muted))',
              }}
              transition={{ duration: 0.2 }}
              className="w-2.5 h-2.5 rounded-full cursor-pointer hover:scale-125"
              onClick={() => {
                const element = document.getElementById(floor.id);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
        
        {/* Building Icon */}
        <div className="flex justify-center mt-4 pt-4 border-t border-border">
          <Building2 className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

// Floor transition indicator
const FloorTransition = ({ direction }: { direction: 'up' | 'down' }) => {
  return (
    <div className="relative h-0 overflow-visible z-30 pointer-events-none">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-20%" }}
        className="absolute left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
    </div>
  );
};

const BuildingJourney = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(4);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Update current floor based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      if (value < 0.2) setCurrentFloor(4);
      else if (value < 0.45) setCurrentFloor(3);
      else if (value < 0.7) setCurrentFloor(2);
      else setCurrentFloor(1);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const currentFloorData = floors.find(f => f.number === currentFloor);

  const scrollToServices = () => {
    const element = document.getElementById('services');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Elevator Indicator */}
      <ElevatorIndicator 
        currentFloor={currentFloor} 
        floorName={currentFloorData?.name || ''} 
      />

      {/* Floor 4: Hero/Terrace */}
      <section id="home">
        <HeroFloor onScrollToNext={scrollToServices} />
      </section>

      <FloorTransition direction="down" />

      {/* Floor 3: Living Room (Services) */}
      <section>
        <LivingRoomFloor />
      </section>

      <FloorTransition direction="down" />

      {/* Floor 2: Villa Garden (Studio) */}
      <section>
        <VillaGardenFloor />
      </section>

      <FloorTransition direction="down" />

      {/* Floor 1: Tower (Contact) */}
      <section>
        <TowerContactFloor />
      </section>
    </div>
  );
};

export default BuildingJourney;
