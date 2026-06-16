import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Building2, Users, Award, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

interface HeroFloorProps {
  onScrollToNext?: () => void;
}

const HeroFloor = ({ onScrollToNext }: HeroFloorProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Scroll-linked parallax and fade effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0.75]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Video play error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const stats = [
    { icon: Building2, value: '150+', label: t('hero.completed_projects') },
    { icon: Users, value: '80+', label: t('hero.satisfied_clients') },
    { icon: Award, value: '15+', label: t('hero.years_experience') },
  ];

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center"
    >
      {/* 1. Cinematic Background Video */}
      <motion.div 
        style={{ scale: videoScale }}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-85"
        >
          <source src="/assets/video_header.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* 2. Color Contrast Overlay Grids (Responsive Premium Scrims) */}
      <motion.div 
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-0 pointer-events-none ltr:hero-scrim-ltr rtl:hero-scrim-rtl" 
      />
      
      {/* 3. Structural Blueprint grid lines (fine overlay) */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem] z-0" />
      
      {/* 4. Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 flex flex-col justify-between min-h-screen">
        
        {/* Empty spacing for top padding under fixed navbar */}
        <div className="h-16" />

        {/* Text area */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="text-start max-w-4xl mt-auto mb-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/25 border border-primary/40 text-primary-light text-[11px] font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{t('hero.tagline')}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white leading-[1.02] mb-6 tracking-tighter"
          >
            {t('hero.tagline')}
            <span className="text-gradient-primary font-normal font-display block mt-3 tracking-normal">
              {t('hero.tagline_span')}
            </span>
          </motion.h1>

          {/* Subtitle / Pillars */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-xl text-white font-medium mb-6 border-s-4 border-primary ps-4 tracking-wide max-w-3xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-slate-200 text-sm sm:text-lg max-w-2xl mb-10 leading-relaxed font-normal"
          >
            {t('hero.desc')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white font-bold text-[11px] uppercase tracking-widest px-8 py-7 shadow-xl shadow-primary/25 group transition-all duration-300"
              onClick={onScrollToNext}
            >
              <span>{t('hero.explore')}</span>
              <ArrowDown className="ms-2 w-4 h-4 group-hover:translate-y-1.5 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white font-bold text-[11px] uppercase tracking-widest px-8 py-7 backdrop-blur-sm transition-all duration-300"
              asChild
            >
              <a href="#studio">{t('hero.projects')}</a>
            </Button>
          </motion.div>

          {/* Repositioned & Redesigned Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mt-12 max-w-3xl shadow-[0_24px_60px_rgba(0,0,0,0.5)] z-10"
          >
            {/* Dot-grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0 opacity-80" />
            
            {/* Glowing corner gradient */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none z-0" />
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="flex flex-col items-start pt-4 sm:pt-0 sm:px-6 first:pt-0 first:ps-0 last:pe-0 group"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-widest uppercase mt-0.5 block leading-relaxed">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer info (Video Controls Only) */}
        <div className="flex items-center justify-between border-t border-white/10 pt-8 pb-4 mt-auto">
          <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-widest">
            {t('hero.tagline_span')}
          </div>
          
          {/* Media Controls for Background Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-3 bg-white/5 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md"
          >
            <button
              onClick={togglePlay}
              className="p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title={isPlaying ? "Pause Background Video" : "Play Background Video"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="w-px h-4 bg-white/25" />
            <button
              onClick={toggleMute}
              className="p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title={isMuted ? "Unmute Background Sound" : "Mute Background Sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Parallax bottom indicator */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block cursor-pointer"
        onClick={onScrollToNext}
      >
        <div className="flex flex-col items-center gap-2 text-white/40 hover:text-primary transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest">{t('hero.scroll')}</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-1.5 rounded-full bg-primary"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroFloor;
