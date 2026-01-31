import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ArrowRight, TreePine, Flower2 } from 'lucide-react';
import { Button } from '../ui/button';

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

const categories = ['All', 'Commercial', 'Residential', 'Corporate', 'Cultural'];

const VillaGardenFloor = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div 
      id="studio"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, 
            hsl(var(--muted) / 0.2) 0%, 
            hsl(150 30% 97%) 20%, 
            hsl(150 20% 96%) 50%,
            hsl(150 30% 97%) 80%,
            hsl(var(--muted) / 0.2) 100%
          )
        `
      }}
    >
      {/* Garden background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Organic shapes */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 2, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-accent-teal/10 to-accent-teal/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -2, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/10 to-primary/5 blur-3xl"
        />

        {/* Decorative garden elements */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-accent-teal/10 to-transparent" />
        
        {/* Floating trees/plants icons */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-32 left-[5%] text-accent-teal/20"
        >
          <TreePine className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-48 right-[8%] text-primary/20"
        >
          <Flower2 className="w-12 h-12" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 py-24 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-sm font-semibold mb-6"
          >
            <Flower2 className="w-4 h-4" />
            Villa Garden Gallery
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            The <span className="text-gradient-feather">Studio</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Explore our curated collection of award-winning architectural projects, 
            displayed in our premium villa garden gallery.
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
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === category
                  ? 'gradient-feather text-primary-foreground shadow-lg shadow-accent-teal/20'
                  : 'bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-foreground border border-border/50 hover:border-accent-teal/30'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - Floating frames effect */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12, rotateY: 5 }}
                className="group cursor-pointer perspective-1000"
                onClick={() => setSelectedProject(project)}
              >
                {/* Floating frame effect */}
                <div className="relative bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-border/50 hover:border-primary/30">
                  {/* Frame mount effect */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-border/50 rounded-b-lg z-10" />
                  
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2 text-primary-foreground"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">View Project</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium text-foreground border border-border/50 shadow-lg">
                      {project.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-gradient-to-b from-card to-muted/20">
                    <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/70 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
              >
                <X className="w-6 h-6" />
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
              <div className="p-8 md:p-10">
                <span className="inline-block px-4 py-2 rounded-full bg-accent-teal/15 text-accent-teal text-sm font-semibold mb-4">
                  {selectedProject.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
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
                    Full Case Study
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VillaGardenFloor;
