import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Building2, 
  Ruler, 
  HardHat, 
  Wrench, 
  Home, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const services = [
  {
    icon: Building2,
    title: 'Architectural Design',
    description: 'Custom architectural solutions for residential and commercial projects, blending aesthetics with functionality.',
    features: ['Concept Development', 'Design Visualization', 'Building Permits'],
  },
  {
    icon: Ruler,
    title: 'Structural Engineering',
    description: 'Expert structural analysis and design ensuring safety, durability, and code compliance for all building types.',
    features: ['Load Analysis', 'Foundation Design', 'Seismic Assessment'],
  },
  {
    icon: HardHat,
    title: 'Construction Management',
    description: 'End-to-end project oversight from groundbreaking to completion, ensuring on-time and on-budget delivery.',
    features: ['Project Planning', 'Quality Control', 'Timeline Management'],
  },
  {
    icon: Lightbulb,
    title: 'MEP Design',
    description: 'Comprehensive mechanical, electrical, and plumbing systems design for optimal building performance.',
    features: ['HVAC Systems', 'Electrical Planning', 'Plumbing Layout'],
  },
  {
    icon: Home,
    title: 'Renovation Services',
    description: 'Transform existing spaces with expert renovation and remodeling solutions that maximize value.',
    features: ['Space Optimization', 'Modern Upgrades', 'Heritage Restoration'],
  },
  {
    icon: Wrench,
    title: 'Consulting Services',
    description: 'Professional engineering consultation for feasibility studies, code compliance, and project optimization.',
    features: ['Feasibility Studies', 'Code Review', 'Cost Estimation'],
  },
];

const LivingRoomFloor = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      id="services" 
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Background Image - Living Room */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Our Engineering &{' '}
            <span className="text-primary">Architecture Services</span>
          </h2>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Comprehensive solutions for every stage of your construction project, 
            from initial concept to final delivery.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:-translate-y-1">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Learn More */}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary/80 font-semibold group/btn"
                  >
                    Learn More 
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-14"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-6 text-lg shadow-xl"
          >
            Request a Consultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LivingRoomFloor;
