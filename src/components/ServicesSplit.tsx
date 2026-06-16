import { useState } from 'react';
import { motion } from 'framer-motion';
import { HardHat, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const ServicesSplit = () => {
  const { t, i18n } = useTranslation();
  const [hovered, setHovered] = useState<'eng' | 'studio' | null>(null);
  
  const isRtl = i18n.language === 'ar';

  return (
    <section id="split-section" className="relative py-28 bg-white overflow-hidden">
      {/* Structural background lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-slate-100" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <span>{t('split.title')}</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight"
          >
            {t('split.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-light"
          >
            {t('split.subtitle')}
          </motion.p>
        </div>

        {/* Interactive Split Panels */}
        <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[600px] items-stretch">
          
          {/* Engineering Services - Technical Side (Blueprint Style) */}
          <motion.div
            onMouseEnter={() => setHovered('eng')}
            onMouseLeave={() => setHovered(null)}
            animate={{
              flex: hovered === 'eng' ? 1.4 : hovered === 'studio' ? 0.6 : 1
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className={`relative rounded-3xl overflow-hidden flex flex-col justify-between p-10 sm:p-14 transition-all duration-500 border-2 ${
              hovered === 'eng' 
                ? 'border-primary shadow-2xl shadow-primary/15' 
                : 'border-slate-800'
            } bg-slate-950 text-white min-h-[420px] lg:min-h-0 group`}
          >
            {/* Technical grid line background */}
            <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-500 pointer-events-none bg-[linear-gradient(to_right,#00d2ff_1px,transparent_1px),linear-gradient(to_bottom,#00d2ff_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
            
            {/* Decorative CAD coordinates */}
            <div className="absolute top-6 right-6 text-[10px] font-mono text-cyan-500/30 select-none hidden sm:block">
              COORD: X=192.42 // Y=492.11 // Z=0.00
            </div>

            <div>
              {/* Header Info */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HardHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                    {t('split.engineering.title')}
                  </h3>
                  <p className="text-sm text-slate-400 font-mono font-medium">{t('split.engineering.subtitle')}</p>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-3xl sm:text-4xl font-mono font-bold mb-6 tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {t('split.engineering.title')}
              </h4>
              <p className="text-slate-300 text-base mb-10 leading-relaxed max-w-lg font-light">
                {t('split.engineering.desc')}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-10 font-mono text-sm text-slate-400">
                {(t('split.engineering.features', { returnObjects: true }) as string[]).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-none shadow-[0_0_8px_#22d3ee]" />
                    <span className="group-hover:text-slate-200 transition-colors">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <Button 
                variant="hero" 
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono shadow-lg shadow-cyan-500/10 w-full sm:w-auto"
                asChild
              >
                <a href="#services" className="flex items-center justify-center gap-2">
                  <span>{t('split.engineering.cta')}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Design Studio - Creative Side (Editorial Style) */}
          <motion.div
            onMouseEnter={() => setHovered('studio')}
            onMouseLeave={() => setHovered(null)}
            animate={{
              flex: hovered === 'studio' ? 1.4 : hovered === 'eng' ? 0.6 : 1
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className={`relative rounded-3xl overflow-hidden flex flex-col justify-between p-10 sm:p-14 transition-all duration-500 border-2 ${
              hovered === 'studio' 
                ? 'border-amber-700/60 shadow-2xl shadow-amber-900/10' 
                : 'border-slate-100 shadow-lg'
            } bg-[#faf7f2] text-amber-950 min-h-[420px] lg:min-h-0 group`}
          >
            {/* Soft cream-gold radial lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/35 via-white/80 to-amber-50/25 -z-10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-amber-200/20 transition-all duration-700" />

            <div>
              {/* Header Info */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-xl bg-amber-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                    {t('split.studio.title')}
                  </h3>
                  <p className="text-sm text-amber-900/60 font-medium italic">{t('split.studio.subtitle')}</p>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-3xl sm:text-4xl font-display font-semibold italic mb-6 leading-tight text-amber-950 group-hover:text-amber-900 transition-colors">
                {t('split.studio.title')}
              </h4>
              <p className="text-amber-900/80 text-base mb-10 leading-relaxed max-w-lg font-light">
                {t('split.studio.desc')}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-10 text-sm text-amber-900/80">
                {(t('split.studio.features', { returnObjects: true }) as string[]).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-amber-850 hover:bg-amber-900 text-white shadow-lg w-full sm:w-auto"
                asChild
              >
                <a href="#decor-builder" className="flex items-center justify-center gap-2">
                  <span>{t('split.studio.cta')}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </a>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSplit;
