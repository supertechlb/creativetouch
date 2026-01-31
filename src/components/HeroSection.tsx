import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Award, Building2, Users } from 'lucide-react';
import { Button } from './ui/button';
import HeroScene from './HeroScene';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollProgress(value);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  const stats = [
    { icon: Building2, value: '150+', label: 'Projects Completed' },
    { icon: Users, value: '80+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
  ];

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[300vh] gradient-hero"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="relative z-10"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6"
            >
              Engineering & Architecture Excellence
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6"
            >
              Building the{' '}
              <span className="text-gradient-primary">Future</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 font-body"
            >
              From concept to completion — we transform your vision into 
              extraordinary architectural masterpieces. Your trusted partner 
              for engineering excellence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Button variant="hero" size="xl">
                Start Your Project
              </Button>
              <Button variant="heroOutline" size="xl">
                View Our Work
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground font-display">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D Building */}
          <div className="relative h-[500px] lg:h-[600px]">
            <div className="absolute inset-0 shadow-building rounded-3xl overflow-hidden">
              <HeroScene scrollProgress={scrollProgress} />
            </div>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <span className="text-sm font-medium">Scroll to build</span>
                <ArrowDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Text Sections */}
      <div className="relative z-10 pt-[100vh]">
        {[
          { title: 'Design', description: 'Conceptualizing spaces that inspire and endure' },
          { title: 'Engineer', description: 'Precision engineering for structural excellence' },
          { title: 'Build', description: 'Bringing visions to life with meticulous craftsmanship' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-20%' }}
            className="h-[50vh] flex items-center"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-md glass-card-strong rounded-2xl p-8">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Step {index + 1}
                </span>
                <h3 className="text-4xl font-display font-bold text-foreground mt-2 mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
