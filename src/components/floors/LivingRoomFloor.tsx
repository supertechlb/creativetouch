import { motion } from 'framer-motion';
import { PenTool, Compass, Building2, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/button';

const services = [
  {
    icon: PenTool,
    title: 'Design',
    description: 'From initial sketches to detailed architectural drawings, we craft spaces that inspire and endure.',
    features: ['Conceptual Design', '3D Visualization', 'Interior Design', 'Landscape Architecture'],
    color: 'from-primary to-primary-dark',
    accent: 'primary',
  },
  {
    icon: Compass,
    title: 'Engineering',
    description: 'Precision engineering solutions that ensure structural integrity and push innovation boundaries.',
    features: ['Structural Analysis', 'MEP Design', 'Sustainability', 'Project Management'],
    color: 'from-secondary to-secondary-dark',
    accent: 'secondary',
  },
  {
    icon: Building2,
    title: 'Construction',
    description: 'End-to-end construction management bringing your architectural vision to life.',
    features: ['Project Execution', 'Quality Control', 'Timeline Management', 'Cost Optimization'],
    color: 'from-accent-teal to-accent-magenta',
    accent: 'accent-teal',
  },
];

const LivingRoomFloor = () => {
  return (
    <div 
      id="services"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, hsl(var(--muted) / 0.3) 0%, hsl(var(--background)) 10%, hsl(var(--background)) 90%, hsl(var(--muted) / 0.3) 100%)
        `
      }}
    >
      {/* Living room background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Architectural lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative furniture silhouettes */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-muted/20 to-transparent" />
        
        {/* Floating accent shapes */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-[15%] w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 blur-xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-40 left-[10%] w-48 h-48 rounded-full bg-gradient-to-br from-secondary/10 to-secondary/5 blur-2xl"
        />
      </div>

      {/* Section transition - elevator effect */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 py-24 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-sm font-semibold mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            The Living Room
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Our <span className="text-gradient-secondary">Services</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Comprehensive architectural and engineering solutions tailored to transform 
            your vision into spaces that inspire.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-full bg-card rounded-3xl p-8 shadow-lg border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <service.icon className="w-8 h-8 text-primary-foreground" />
                  
                  {/* Floating particle */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-${service.accent}`}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <motion.div 
                  className="flex items-center gap-2 text-primary font-medium cursor-pointer group/link"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button variant="hero" size="xl" className="shadow-xl shadow-primary/20">
            Explore All Services
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
};

export default LivingRoomFloor;
