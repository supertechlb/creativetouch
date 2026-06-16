import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

const VillaGardenFloor = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const categories = [
    t('portfolio.all'),
    t('portfolio.residential'),
    t('portfolio.commercial'),
    t('portfolio.renovation')
  ];

  const projects = [
    {
      id: 1,
      title: t('portfolio.project1.title'),
      category: t('portfolio.residential'),
      location: t('portfolio.project1.location'),
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      description: t('portfolio.project1.desc'),
    },
    {
      id: 2,
      title: t('portfolio.project2.title'),
      category: t('portfolio.commercial'),
      location: t('portfolio.project2.location'),
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      description: t('portfolio.project2.desc'),
    },
    {
      id: 3,
      title: t('portfolio.project3.title'),
      category: t('portfolio.renovation'),
      location: t('portfolio.project3.location'),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: t('portfolio.project3.desc'),
    },
    {
      id: 4,
      title: t('portfolio.project4.title'),
      category: t('portfolio.residential'),
      location: t('portfolio.project4.location'),
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      description: t('portfolio.project4.desc'),
    },
    {
      id: 5,
      title: t('portfolio.project5.title'),
      category: t('portfolio.commercial'),
      location: t('portfolio.project5.location'),
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      description: t('portfolio.project5.desc'),
    },
    {
      id: 6,
      title: t('portfolio.project6.title'),
      category: t('portfolio.renovation'),
      location: t('portfolio.project6.location'),
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
      description: t('portfolio.project6.desc'),
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // Sync activeCategory default when language switches
  useEffect(() => {
    setActiveCategory(t('portfolio.all'));
  }, [i18n.language]);

  const filteredProjects = activeCategory === t('portfolio.all') 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section 
      id="studio" 
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden text-start"
    >
      {/* Background Image - Luxury Villa */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/80 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {t('portfolio.desc')}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={`
                font-semibold transition-all duration-300
                ${activeCategory === category 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white/10 text-white border-white/30 hover:bg-white hover:text-slate-900'
                }
              `}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <Card className="group overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-lg">
                      {project.category}
                    </span>
                  </div>

                  {/* View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm"
                      className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-xl"
                    >
                      <ExternalLink className="w-4 h-4 me-2" />
                      {t('portfolio.view_project')}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">{project.location}</p>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg"
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-slate-900 font-semibold px-10 py-6 text-lg"
          >
            {t('portfolio.view_all')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VillaGardenFloor;
