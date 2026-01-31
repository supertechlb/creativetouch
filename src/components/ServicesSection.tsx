import { motion } from 'framer-motion';
import { Building2, Compass, PenTool, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const services = [
  {
    icon: PenTool,
    title: 'Design',
    description: 'From initial sketches to detailed architectural drawings, we craft spaces that inspire. Our design philosophy blends aesthetics with functionality.',
    features: ['Conceptual Design', '3D Visualization', 'Interior Design', 'Landscape Architecture'],
    gradient: 'from-primary to-primary-dark',
  },
  {
    icon: Compass,
    title: 'Engineering',
    description: 'Precision engineering solutions that ensure structural integrity and innovation. We turn complex challenges into elegant solutions.',
    features: ['Structural Analysis', 'MEP Design', 'Sustainability Consulting', 'Project Management'],
    gradient: 'from-secondary to-secondary-dark',
  },
  {
    icon: Building2,
    title: 'Construction',
    description: 'End-to-end construction management bringing your vision to life. Quality craftsmanship from foundation to finishing touches.',
    features: ['Project Execution', 'Quality Control', 'Timeline Management', 'Cost Optimization'],
    gradient: 'from-accent-teal to-accent-magenta',
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background-soft">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            From A to Z, We've Got You{' '}
            <span className="text-gradient-secondary">Covered</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive architectural and engineering solutions tailored to transform 
            your vision into reality. Every project, every detail, handled with excellence.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-primary/30">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:bg-transparent">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button variant="hero" size="xl">
            Explore All Services
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
