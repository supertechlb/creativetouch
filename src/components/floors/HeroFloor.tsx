import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Building2, Users, Award } from 'lucide-react';
import { Button } from '../ui/button';

const LogoBuild3D = lazy(() => import('../three/LogoBuild3D'));
interface HeroFloorProps {
  onScrollToNext?: () => void;
}

const stats = [
  { icon: Building2, value: '150+', label: 'Projects Completed' },
  { icon: Users, value: '80+', label: 'Satisfied Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
];

const HeroFloor = ({ onScrollToNext }: HeroFloorProps) => {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* 3D Model Container - Prominent and Above Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-lg mx-auto h-[380px] sm:h-[420px] mb-8"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <LogoBuild3D />
            </Suspense>
          </motion.div>

          {/* Headline - SEO Optimized */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-4"
          >
            Premium{' '}
            <span className="text-primary">Architectural Design</span>
            <br />
            & Engineering Solutions
          </motion.h1>

          {/* Subtitle - Keywords */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-600 font-medium mb-4"
          >
            Structural Engineering • Construction Management • MEP Design
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Transform your vision into extraordinary architectural masterpieces. 
            From project planning to renovation, we deliver comprehensive engineering 
            solutions for residential and commercial projects.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-14"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/25 group"
              onClick={onScrollToNext}
            >
              <span>Explore Services</span>
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-semibold px-8 py-6 text-lg"
            >
              View Projects
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">
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
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2 text-slate-500 cursor-pointer hover:text-primary transition-colors"
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
    </section>
  );
};

export default HeroFloor;
