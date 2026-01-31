import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import FloorSection from './FloorSection';
import FloorIndicator from './FloorIndicator';

interface Room {
  name: string;
  image: string;
  description: string;
}

interface Floor {
  number: number;
  name: string;
  tagline: string;
  rooms: Room[];
  accentColor: 'primary' | 'secondary' | 'accent';
}

const floorsData: Floor[] = [
  {
    number: 5,
    name: 'Penthouse Suite',
    tagline: 'Where luxury meets the sky — exclusive residential designs for the discerning few.',
    rooms: [
      {
        name: 'Grand Living Room',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        description: 'Expansive open-concept living with floor-to-ceiling windows and panoramic city views.',
      },
      {
        name: 'Sky Terrace',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        description: 'Private outdoor sanctuary with infinity pool and lounge areas.',
      },
    ],
    accentColor: 'primary',
  },
  {
    number: 4,
    name: 'Creative Studio',
    tagline: 'Where ideas come to life — inspiring workspaces that fuel innovation.',
    rooms: [
      {
        name: 'Design Studio',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        description: 'Open collaborative space with natural light and modern amenities.',
      },
      {
        name: 'Executive Meeting Room',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
        description: 'Sophisticated conference space for impactful presentations.',
      },
    ],
    accentColor: 'secondary',
  },
  {
    number: 3,
    name: 'Living Spaces',
    tagline: 'Modern apartments designed for comfort, style, and everyday living.',
    rooms: [
      {
        name: 'Master Bedroom',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
        description: 'Serene retreat with custom millwork and ambient lighting.',
      },
      {
        name: 'Gourmet Kitchen',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        description: 'Chef-inspired kitchen with premium appliances and elegant finishes.',
      },
    ],
    accentColor: 'accent',
  },
  {
    number: 2,
    name: 'Commercial Floor',
    tagline: 'Professional spaces that make a statement — designed for success.',
    rooms: [
      {
        name: 'Corporate Office',
        image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
        description: 'Premium office environment with ergonomic design and technology integration.',
      },
      {
        name: 'Retail Showroom',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        description: 'Curated display spaces that elevate brands and engage customers.',
      },
    ],
    accentColor: 'primary',
  },
  {
    number: 1,
    name: 'Grand Lobby',
    tagline: 'First impressions that last — welcoming spaces that set the tone.',
    rooms: [
      {
        name: 'Reception Hall',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        description: 'Dramatic entrance with double-height ceilings and signature lighting.',
      },
      {
        name: 'Concierge Lounge',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
        description: 'Elegant waiting area with curated art and comfortable seating.',
      },
    ],
    accentColor: 'secondary',
  },
];

const BuildingInterior = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(5);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      // Map scroll progress to floor number (5 floors)
      const floorIndex = Math.min(Math.floor(value * floorsData.length), floorsData.length - 1);
      const floor = floorsData[floorIndex];
      if (floor) {
        setCurrentFloor(floor.number);
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const currentFloorData = floorsData.find(f => f.number === currentFloor);

  return (
    <section
      ref={containerRef}
      id="building-interior"
      className="relative bg-background"
    >
      {/* Building Entry Header */}
      <div className="relative py-20 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              Begin Your Tour
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Step Inside Our{' '}
              <span className="text-gradient-primary">Creations</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scroll down to explore each floor — from the penthouse to the lobby, 
              discover the artistry behind every space we design.
            </p>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
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
              <span className="text-sm font-medium">Scroll to descend</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute left-1/4 top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Floor Indicator */}
      <FloorIndicator
        currentFloor={currentFloor}
        totalFloors={floorsData.length}
        floorName={currentFloorData?.name || ''}
      />

      {/* Floor Sections */}
      {floorsData.map((floor, index) => (
        <FloorSection
          key={floor.number}
          floorNumber={floor.number}
          floorName={floor.name}
          tagline={floor.tagline}
          rooms={floor.rooms}
          accentColor={floor.accentColor}
          isFirst={index === 0}
          isLast={index === floorsData.length - 1}
        />
      ))}

      {/* Building Exit */}
      <div className="relative py-20 bg-gradient-to-t from-muted/50 to-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Create Your Space?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Every floor tells a story. Let us write yours.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BuildingInterior;
