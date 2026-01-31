import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  details: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Azure Tower',
    category: 'Commercial',
    description: 'A 45-story mixed-use skyscraper featuring sustainable design elements.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    details: 'This landmark project redefines urban living with its innovative approach to vertical architecture. Featuring smart building systems, green terraces on every fifth floor, and a stunning glass facade that reflects the city skyline.',
  },
  {
    id: 2,
    title: 'Serenity Villas',
    category: 'Residential',
    description: 'Luxury waterfront residences with panoramic ocean views.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    details: 'An exclusive collection of 12 waterfront villas designed to harmonize with the natural landscape. Each residence features floor-to-ceiling windows, private infinity pools, and seamless indoor-outdoor living spaces.',
  },
  {
    id: 3,
    title: 'Innovation Hub',
    category: 'Corporate',
    description: 'Tech campus designed for collaboration and creativity.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    details: 'A state-of-the-art technology campus spanning 50,000 square meters. Features include modular workspaces, innovation labs, rooftop gardens, and a central atrium designed to foster spontaneous collaboration.',
  },
  {
    id: 4,
    title: 'Heritage Museum',
    category: 'Cultural',
    description: 'Contemporary museum preserving regional history and art.',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80',
    details: 'This museum seamlessly blends traditional architectural elements with contemporary design. The building houses 15 galleries, a restoration center, an amphitheater, and sculpture gardens spanning 5 acres.',
  },
  {
    id: 5,
    title: 'Green Gardens',
    category: 'Residential',
    description: 'Eco-friendly residential complex with vertical gardens.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    details: 'A revolutionary residential development where nature meets urban living. Each apartment features its own vertical garden, and the complex includes communal farming spaces, solar panels, and rainwater harvesting systems.',
  },
  {
    id: 6,
    title: 'Skyline Mall',
    category: 'Commercial',
    description: 'Futuristic shopping destination with entertainment zones.',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
    details: 'A next-generation retail and entertainment destination covering 200,000 square meters. Features include a retractable glass roof, an indoor theme park, premium cinema complex, and over 400 retail outlets.',
  },
];

const StudioSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Commercial', 'Residential', 'Corporate', 'Cultural'];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="studio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
            The Studio
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Our <span className="text-gradient-primary">Portfolio</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our collection of award-winning projects that showcase our commitment 
            to excellence in design and engineering.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === category
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-500">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div className="flex items-center gap-2 text-primary-foreground">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View Project</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full glass-card text-sm font-medium text-foreground">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                  <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="aspect-video overflow-hidden rounded-t-3xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="inline-block px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                  {selectedProject.category}
                </span>
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {selectedProject.details}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="lg">
                    <Eye className="w-5 h-5" />
                    View in 3D
                  </Button>
                  <Button variant="heroOutline" size="lg">
                    View Full Case Study
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StudioSection;
