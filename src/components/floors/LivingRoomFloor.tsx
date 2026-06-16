import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Building2, 
  Ruler, 
  HardHat, 
  Wrench, 
  Home, 
  Lightbulb,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

const LivingRoomFloor = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isRtl = i18n.language === 'ar';

  const services = [
    {
      icon: Building2,
      code: 'ARCH-01',
      title: t('services.architectural.title'),
      description: t('services.architectural.desc'),
      features: [t('services.architectural.f1'), t('services.architectural.f2'), t('services.architectural.f3')],
    },
    {
      icon: Ruler,
      code: 'STRUC-02',
      title: t('services.structural.title'),
      description: t('services.structural.desc'),
      features: [t('services.structural.f1'), t('services.structural.f2'), t('services.structural.f3')],
    },
    {
      icon: HardHat,
      code: 'CONST-03',
      title: t('services.construction.title'),
      description: t('services.construction.desc'),
      features: [t('services.construction.f1'), t('services.construction.f2'), t('services.construction.f3')],
    },
    {
      icon: Lightbulb,
      code: 'MEP-04',
      title: t('services.mep.title'),
      description: t('services.mep.desc'),
      features: [t('services.mep.f1'), t('services.mep.f2'), t('services.mep.f3')],
    },
    {
      icon: Home,
      code: 'RENOV-05',
      title: t('services.renovation.title'),
      description: t('services.renovation.desc'),
      features: [t('services.renovation.f1'), t('services.renovation.f2'), t('services.renovation.f3')],
    },
    {
      icon: Wrench,
      code: 'CONSULT-06',
      title: t('services.consulting.title'),
      description: t('services.consulting.desc'),
      features: [t('services.consulting.f1'), t('services.consulting.f2'), t('services.consulting.f3')],
    },
  ];

  return (
    <section 
      id="services" 
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden text-start bg-slate-950"
    >
      {/* 1. Technical blueprint background grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(to_right,#00d2ff_1px,transparent_1px),linear-gradient(to_bottom,#00d2ff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#00d2ff_2px,transparent_2px),linear-gradient(to_bottom,#00d2ff_2px,transparent_2px)] bg-[size:15rem_15rem]" />

      {/* Decorative architectural markers */}
      <div className="absolute left-6 top-8 text-[10px] font-mono text-cyan-500/20 select-none">
        [PLAN_ID // 8820-CT-SERVICELINE]
      </div>
      <div className="absolute right-6 bottom-8 text-[10px] font-mono text-cyan-500/20 select-none">
        [SCALE: 1:25 // SECTION A-A]
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-4">
            [TECHNICAL INDEX]
          </span>
          <h2 className="text-4xl sm:text-5xl font-mono font-bold text-white mb-6">
            {t('services.title')}
          </h2>
          <div className="w-20 h-0.5 bg-cyan-500 mx-auto mb-6" />
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            {t('services.desc')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-950/15 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 overflow-hidden relative">
                
                {/* Visual CAD boundary corner markers */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-slate-700 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-slate-700 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-slate-700 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-slate-700 group-hover:border-cyan-400 transition-colors" />

                <CardContent className="p-8">
                  {/* Module Code */}
                  <div className="font-mono text-[10px] text-cyan-500/60 mb-4 tracking-wider flex justify-between items-center">
                    <span>{service.code}</span>
                    <span className="w-1.5 h-1.5 bg-slate-800 rounded-full group-hover:bg-cyan-500 group-hover:shadow-[0_0_6px_#22d3ee] transition-all" />
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center mb-6 shadow-inner border border-slate-750 group-hover:border-cyan-500/30 group-hover:bg-cyan-950/20 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-mono font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 mb-6 leading-relaxed text-sm font-light">
                    {service.description}
                  </p>

                  <div className="h-px bg-slate-800/80 mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 mb-6 font-mono text-[13px] text-slate-400">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1 h-1 bg-cyan-500" />
                        <span className="group-hover:text-slate-300 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technical Link */}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-cyan-400 hover:text-cyan-300 font-mono text-xs font-semibold group/btn tracking-wider hover:bg-transparent"
                  >
                    <span>{t('services.learn_more')}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 ms-1.5 group-hover/btn:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 ms-1.5 group-hover/btn:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-mono font-semibold px-10 py-6 text-base shadow-xl shadow-cyan-950/20 rounded-none border border-cyan-400/30"
            asChild
          >
            <a href="#contact">{t('services.req_consultation')}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LivingRoomFloor;
