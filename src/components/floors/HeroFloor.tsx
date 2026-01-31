import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Building2, Users, Award, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const ConstructionBuilding = lazy(() => import('../three/ConstructionBuilding'));

interface HeroFloorProps {
  onScrollToNext?: () => void;
}

const stats = [
  { icon: Building2, value: '150+', label: 'Projects' },
  { icon: Users, value: '80+', label: 'Clients' },
  { icon: Award, value: '15+', label: 'Years' },
];

const HeroFloor = ({ onScrollToNext }: HeroFloorProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* 3D Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-primary/5 to-secondary/10" />
      }>
        <ConstructionBuilding />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60 pointer-events-none z-10" />

      {/* Orange construction accent lines */}
      <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: `${20 + i * 15}%` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-semibold mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Engineering Excellence
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[1.1] mb-6"
          >
            <span className="block">Building the</span>
            <span className="text-gradient-primary">Future</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light mb-4"
          >
            One Floor at a Time
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From concept to completion — we transform your vision into 
            extraordinary architectural masterpieces through innovative engineering.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Button 
              variant="hero" 
              size="xl" 
              className="group shadow-2xl shadow-primary/20"
              onClick={onScrollToNext}
            >
              <span>Begin Tour</span>
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl" className="backdrop-blur-sm">
              View Our Work
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
          onClick={onScrollToNext}
        >
          <span className="text-xs font-medium uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-3 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroFloor;
