import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RoomCard from './RoomCard';

interface Room {
  name: string;
  image: string;
  description: string;
}

interface FloorSectionProps {
  floorNumber: number;
  floorName: string;
  tagline: string;
  rooms: Room[];
  accentColor: 'primary' | 'secondary' | 'accent';
  isFirst?: boolean;
  isLast?: boolean;
}

const FloorSection = ({
  floorNumber,
  floorName,
  tagline,
  rooms,
  accentColor,
  isFirst,
  isLast,
}: FloorSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const accentGradient = {
    primary: 'from-primary/20 to-secondary/10',
    secondary: 'from-secondary/20 to-accent/10',
    accent: 'from-accent/20 to-primary/10',
  };

  const borderAccent = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
  };

  return (
    <section
      ref={sectionRef}
      id={`floor-${floorNumber}`}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      {/* Architectural Background Elements */}
      <motion.div
        style={{ y: backgroundY }}
        className={`absolute inset-0 bg-gradient-to-b ${accentGradient[accentColor]} pointer-events-none`}
      />
      
      {/* Decorative Pillars */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      {/* Floor Divider - Top */}
      {!isFirst && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}
      
      {/* Content Container */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="container mx-auto px-6 relative z-10"
      >
        {/* Floor Header */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            {/* Floor Number Badge */}
            <div className={`flex items-center justify-center w-16 h-16 rounded-xl border-2 ${borderAccent[accentColor]} bg-card shadow-lg`}>
              <span className="text-2xl font-display font-bold text-foreground">
                {floorNumber}
              </span>
            </div>
            
            {/* Decorative Line */}
            <div className={`flex-1 h-0.5 bg-gradient-to-r from-${accentColor} to-transparent max-w-32`} />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            {floorName}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            {tagline}
          </motion.p>
        </div>
        
        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {rooms.map((room, index) => (
            <RoomCard
              key={room.name}
              name={room.name}
              image={room.image}
              description={room.description}
              index={index}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Floor Divider - Bottom */}
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex justify-center -mb-4">
            <div className={`w-8 h-8 rounded-full border-2 ${borderAccent[accentColor]} bg-card flex items-center justify-center shadow-lg`}>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FloorSection;
