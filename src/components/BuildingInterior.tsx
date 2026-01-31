import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FloorIndicator from './FloorIndicator';

interface Floor {
  number: number;
  name: string;
  tagline: string;
  image: string;
}

const floorsData: Floor[] = [
  {
    number: 7,
    name: 'Rooftop Terrace',
    tagline: 'Where the sky meets luxury',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
  },
  {
    number: 6,
    name: 'Penthouse Living',
    tagline: 'Open-concept elegance',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  },
  {
    number: 5,
    name: 'Gourmet Kitchen',
    tagline: 'Culinary perfection',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80',
  },
  {
    number: 4,
    name: 'Master Bedroom',
    tagline: 'Serene retreat',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80',
  },
  {
    number: 3,
    name: 'Creative Office',
    tagline: 'Where ideas flourish',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
  },
  {
    number: 2,
    name: 'Villa Exterior',
    tagline: 'Mediterranean beauty',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  },
  {
    number: 1,
    name: 'Grand Lobby',
    tagline: 'First impressions last',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
  },
];

const BuildingInterior = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(7);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Update current floor based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const floorIndex = Math.min(
        Math.floor(value * floorsData.length),
        floorsData.length - 1
      );
      setCurrentFloor(floorsData[floorIndex]?.number ?? 7);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const currentFloorData = floorsData.find(f => f.number === currentFloor);

  return (
    <section
      ref={containerRef}
      id="building-interior"
      className="relative"
      style={{ height: `${floorsData.length * 100}vh` }}
    >
      {/* Fixed fullscreen container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background layers */}
        {floorsData.map((floor, index) => (
          <FloorBackground
            key={floor.number}
            floor={floor}
            index={index}
            totalFloors={floorsData.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-20 z-10">
          {/* Dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
          
          {/* Floor info */}
          <motion.div
            key={currentFloor}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center px-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-sm font-semibold mb-4">
              Floor {currentFloorData?.number}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-3">
              {currentFloorData?.name}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              {currentFloorData?.tagline}
            </p>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              </div>
              <span className="text-xs font-medium">Scroll to explore</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floor Indicator */}
      <FloorIndicator
        currentFloor={currentFloor}
        totalFloors={floorsData.length}
        floorName={currentFloorData?.name || ''}
      />
    </section>
  );
};

// Separate component for floor background with opacity animation
interface FloorBackgroundProps {
  floor: Floor;
  index: number;
  totalFloors: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

const FloorBackground = ({ floor, index, totalFloors, scrollYProgress }: FloorBackgroundProps) => {
  // Calculate opacity based on scroll position
  // Each floor gets 1/totalFloors of the scroll range
  const segmentSize = 1 / totalFloors;
  const start = index * segmentSize;
  const peak = start + segmentSize * 0.5;
  const end = start + segmentSize;

  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, start - segmentSize * 0.3),
      start,
      peak,
      end,
      Math.min(1, end + segmentSize * 0.3),
    ],
    [0, 1, 1, 1, 0]
  );

  // First floor starts visible
  const adjustedOpacity = useTransform(opacity, (value) => {
    if (index === 0) {
      return Math.max(value, scrollYProgress.get() < 0.1 ? 1 : value);
    }
    return value;
  });

  return (
    <motion.div
      style={{ opacity: index === 0 ? 1 : adjustedOpacity }}
      className="absolute inset-0"
    >
      <img
        src={floor.image}
        alt={floor.name}
        className="w-full h-full object-cover"
        loading={index < 2 ? 'eager' : 'lazy'}
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-background/10" />
    </motion.div>
  );
};

export default BuildingInterior;
