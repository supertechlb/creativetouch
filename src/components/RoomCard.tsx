import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  name: string;
  image: string;
  description: string;
  index: number;
}

const RoomCard = ({ name, image, description, index }: RoomCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true, margin: '-10%' }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-elegant"
    >
      {/* Image Container with Parallax */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Decorative Corner */}
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h4 className="text-xl font-display font-bold text-foreground mb-2">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
      
      {/* Hover Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default RoomCard;
