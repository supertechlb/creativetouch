import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown, Award, Building2, Users, PenTool, Compass, ArrowRight, X, Eye, Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from './ui/button';
import FloorIndicator from './FloorIndicator';

// ============= Projects Data =============
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

// ============= Services Data =============
const services = [
  {
    icon: PenTool,
    title: 'Design',
    description: 'From initial sketches to detailed architectural drawings, we craft spaces that inspire.',
    features: ['Conceptual Design', '3D Visualization', 'Interior Design', 'Landscape Architecture'],
    gradient: 'from-primary to-primary-dark',
  },
  {
    icon: Compass,
    title: 'Engineering',
    description: 'Precision engineering solutions that ensure structural integrity and innovation.',
    features: ['Structural Analysis', 'MEP Design', 'Sustainability Consulting', 'Project Management'],
    gradient: 'from-secondary to-secondary-dark',
  },
  {
    icon: Building2,
    title: 'Construction',
    description: 'End-to-end construction management bringing your vision to life.',
    features: ['Project Execution', 'Quality Control', 'Timeline Management', 'Cost Optimization'],
    gradient: 'from-accent-teal to-accent-magenta',
  },
];

// ============= Floor Configuration =============
interface Floor {
  number: number;
  name: string;
  sectionId: string;
  image: string;
  scrollHeight: number; // in vh
}

const floorsData: Floor[] = [
  {
    number: 4,
    name: 'Rooftop Terrace',
    sectionId: 'home',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
    scrollHeight: 100,
  },
  {
    number: 3,
    name: 'Penthouse Living',
    sectionId: 'services',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    scrollHeight: 120,
  },
  {
    number: 2,
    name: 'Creative Office',
    sectionId: 'studio',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
    scrollHeight: 150,
  },
  {
    number: 1,
    name: 'Grand Lobby',
    sectionId: 'contact',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
    scrollHeight: 120,
  },
];

const totalScrollHeight = floorsData.reduce((acc, f) => acc + f.scrollHeight, 0);

// ============= Main Component =============
const BuildingInterior = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFloor, setCurrentFloor] = useState(4);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate cumulative scroll thresholds for each floor
  const floorThresholds = floorsData.reduce((acc, floor, index) => {
    const prevTotal = index === 0 ? 0 : acc[index - 1].end;
    const floorRatio = floor.scrollHeight / totalScrollHeight;
    acc.push({
      start: prevTotal,
      end: prevTotal + floorRatio,
    });
    return acc;
  }, [] as { start: number; end: number }[]);

  // Update current floor based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      for (let i = 0; i < floorThresholds.length; i++) {
        if (value >= floorThresholds[i].start && value < floorThresholds[i].end) {
          setCurrentFloor(floorsData[i].number);
          break;
        }
        if (i === floorThresholds.length - 1 && value >= floorThresholds[i].end) {
          setCurrentFloor(floorsData[i].number);
        }
      }
    });
    return unsubscribe;
  }, [scrollYProgress, floorThresholds]);

  const currentFloorData = floorsData.find(f => f.number === currentFloor);

  // Filter projects for Studio section
  const categories = ['All', 'Commercial', 'Residential', 'Corporate', 'Cultural'];
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  // Contact info
  const contactInfo = [
    { icon: MapPin, label: 'Visit Us', value: '123 Architecture Ave, Design District' },
    { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567' },
    { icon: Mail, label: 'Email Us', value: 'hello@creativetouch.studio' },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Fri: 9AM - 6PM' },
  ];

  const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Interior Design', 'Renovation', 'Consultation'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // Stats for Hero
  const stats = [
    { icon: Building2, value: '150+', label: 'Projects Completed' },
    { icon: Users, value: '80+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
  ];

  return (
    <section
      ref={containerRef}
      id="building-interior"
      className="relative"
      style={{ height: `${totalScrollHeight}vh` }}
    >
      {/* Fixed fullscreen container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background layers */}
        {floorsData.map((floor, index) => (
          <FloorBackground
            key={floor.number}
            floor={floor}
            index={index}
            floorThresholds={floorThresholds}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Dark overlay for content readability */}
        <div className="absolute inset-0 bg-background/40 pointer-events-none z-5" />

        {/* Content Container */}
        <div className="absolute inset-0 z-10 overflow-y-auto pointer-events-none">
          <div className="pointer-events-auto">
            {/* ===== FLOOR 4: HERO ===== */}
            <div className="min-h-screen flex items-center justify-center px-6 py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                {/* Glass Container */}
                <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50">
                  {/* Badge */}
                  <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6">
                    Engineering & Architecture Excellence
                  </span>
                  
                  {/* Headline */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-4">
                    Building the{' '}
                    <span className="text-gradient-primary">Future</span>
                  </h1>
                  <p className="text-2xl md:text-3xl text-muted-foreground font-normal mb-6">
                    One Floor at a Time
                  </p>
                  
                  {/* Description */}
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    From concept to completion — we transform your vision into 
                    extraordinary architectural masterpieces. Step inside and explore 
                    the spaces we create.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <Button variant="hero" size="xl" className="group">
                      Begin Tour
                      <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </Button>
                    <Button variant="heroOutline" size="xl">
                      View Our Work
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-8 border-t border-border/50">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center shadow-lg">
                          <stat.icon className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground font-display">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-2 text-muted-foreground"
                  >
                    <span className="text-sm font-medium">Scroll to explore</span>
                    <ArrowDown className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* ===== FLOOR 3: SERVICES ===== */}
            <div id="services" className="min-h-screen flex items-center px-6 py-20" style={{ minHeight: '120vh' }}>
              <div className="container mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center max-w-3xl mx-auto mb-12"
                >
                  <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50 inline-block">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
                      Our Services
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                      From A to Z, We've Got You{' '}
                      <span className="text-gradient-secondary">Covered</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Comprehensive architectural and engineering solutions tailored to transform 
                      your vision into reality.
                    </p>
                  </div>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      viewport={{ once: true }}
                    >
                      <div className="h-full bg-card/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-300">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5`}>
                          <service.icon className="w-7 h-7 text-primary-foreground" />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-display font-bold text-foreground mb-3">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                          {service.description}
                        </p>

                        {/* Features List */}
                        <ul className="space-y-2">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== FLOOR 2: STUDIO ===== */}
            <div id="studio" className="min-h-screen px-6 py-20" style={{ minHeight: '150vh' }}>
              <div className="container mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center max-w-3xl mx-auto mb-10"
                >
                  <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50 inline-block">
                    <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6">
                      The Studio
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                      Our <span className="text-gradient-primary">Portfolio</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Explore our collection of award-winning projects.
                    </p>
                  </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap justify-center gap-3 mb-10"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filter === category
                          ? 'gradient-primary text-primary-foreground shadow-md'
                          : 'bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="relative overflow-hidden rounded-2xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                          {/* Image */}
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                            <div className="flex items-center gap-2 text-primary-foreground">
                              <Eye className="w-5 h-5" />
                              <span className="font-medium">View Project</span>
                            </div>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4 bg-card/60 backdrop-blur-sm rounded-xl p-4">
                          <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* ===== FLOOR 1: CONTACT ===== */}
            <div id="contact" className="min-h-screen flex items-center px-6 py-20" style={{ minHeight: '120vh' }}>
              <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Left: Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50">
                      <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
                        Get In Touch
                      </span>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Let's Build Something{' '}
                        <span className="text-gradient-primary">Extraordinary</span>
                      </h2>
                      <p className="text-muted-foreground mb-8 leading-relaxed">
                        Ready to transform your vision into reality? We're 
                        here to help bring your dreams to life.
                      </p>

                      {/* Contact Info Cards */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {contactInfo.map((info, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
                          >
                            <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center mb-3">
                              <info.icon className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">{info.label}</h4>
                            <p className="text-xs text-muted-foreground">{info.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: Form */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="bg-card/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50"
                    >
                      <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                        Get a Quote
                      </h3>

                      <div className="space-y-4">
                        {/* Name */}
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 rounded-xl bg-background/80 border-2 transition-all duration-300 outline-none ${
                            focusedField === 'name'
                              ? 'border-primary shadow-md'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                          required
                        />

                        {/* Email & Phone */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-4 py-3 rounded-xl bg-background/80 border-2 transition-all duration-300 outline-none ${
                              focusedField === 'email'
                                ? 'border-primary shadow-md'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-4 py-3 rounded-xl bg-background/80 border-2 transition-all duration-300 outline-none ${
                              focusedField === 'phone'
                                ? 'border-secondary shadow-md'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                          />
                        </div>

                        {/* Project Type */}
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          onFocus={() => setFocusedField('type')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 rounded-xl bg-background/80 border-2 transition-all duration-300 outline-none appearance-none cursor-pointer ${
                            focusedField === 'type'
                              ? 'border-primary shadow-md'
                              : 'border-border hover:border-muted-foreground'
                          } ${!formData.projectType ? 'text-muted-foreground' : 'text-foreground'}`}
                          required
                        >
                          <option value="">Select Project Type</option>
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        {/* Message */}
                        <textarea
                          placeholder="Tell us about your project..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl bg-background/80 border-2 transition-all duration-300 outline-none resize-none ${
                            focusedField === 'message'
                              ? 'border-primary shadow-md'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                          required
                        />

                        {/* Submit Button */}
                        <Button variant="hero" size="xl" className="w-full">
                          Send Message
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Indicator */}
      <FloorIndicator
        currentFloor={currentFloor}
        totalFloors={floorsData.length}
        floorName={currentFloorData?.name || ''}
      />

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

// ============= Floor Background Component =============
interface FloorBackgroundProps {
  floor: Floor;
  index: number;
  floorThresholds: { start: number; end: number }[];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

const FloorBackground = ({ floor, index, floorThresholds, scrollYProgress }: FloorBackgroundProps) => {
  const { start, end } = floorThresholds[index];
  const mid = (start + end) / 2;

  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, start - 0.05),
      start,
      mid,
      end,
      Math.min(1, end + 0.05),
    ],
    [0, 1, 1, 1, 0]
  );

  // First floor starts visible
  const adjustedOpacity = useTransform(opacity, (value) => {
    if (index === 0) {
      return Math.max(value, scrollYProgress.get() < 0.05 ? 1 : value);
    }
    return value;
  });

  return (
    <motion.div
      style={{ opacity: index === 0 ? 1 : adjustedOpacity }}
      className="absolute inset-0"
    >
      <img
        src={floor.image}
        alt={floor.name}
        className="w-full h-full object-cover"
        loading={index < 2 ? 'eager' : 'lazy'}
      />
    </motion.div>
  );
};

export default BuildingInterior;
