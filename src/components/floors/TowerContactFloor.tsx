import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, Building2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const contactInfo = [
  { icon: MapPin, label: 'Visit Us', value: '123 Architecture Ave, Design District', floor: 45 },
  { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567', floor: 35 },
  { icon: Mail, label: 'Email Us', value: 'hello@creativetouch.studio', floor: 25 },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Fri: 9AM - 6PM', floor: 15 },
];

const projectTypes = [
  'Residential',
  'Commercial',
  'Industrial',
  'Interior Design',
  'Renovation',
  'Consultation',
];

const TowerContactFloor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div 
      id="contact"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, 
            hsl(var(--muted) / 0.2) 0%, 
            hsl(220 20% 14%) 30%,
            hsl(220 25% 10%) 60%,
            hsl(220 30% 8%) 100%
          )
        `
      }}
    >
      {/* Tower skyline background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* City lights effect */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${40 + Math.random() * 50}%`,
              }}
            />
          ))}
        </div>

        {/* Abstract tower silhouettes */}
        <svg className="absolute bottom-0 left-0 w-full h-3/4 opacity-20" preserveAspectRatio="none" viewBox="0 0 1200 600">
          <defs>
            <linearGradient id="towerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Tower shapes */}
          <rect x="50" y="100" width="80" height="500" fill="url(#towerGradient)" rx="4" />
          <rect x="180" y="200" width="60" height="400" fill="url(#towerGradient)" rx="4" />
          <rect x="280" y="50" width="100" height="550" fill="url(#towerGradient)" rx="4" />
          <rect x="420" y="150" width="70" height="450" fill="url(#towerGradient)" rx="4" />
          <rect x="540" y="80" width="90" height="520" fill="url(#towerGradient)" rx="4" />
          <rect x="680" y="180" width="75" height="420" fill="url(#towerGradient)" rx="4" />
          <rect x="800" y="120" width="85" height="480" fill="url(#towerGradient)" rx="4" />
          <rect x="930" y="200" width="65" height="400" fill="url(#towerGradient)" rx="4" />
          <rect x="1040" y="100" width="95" height="500" fill="url(#towerGradient)" rx="4" />
        </svg>

        {/* Glowing primary tower */}
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[70%] bg-gradient-to-t from-primary/20 to-transparent blur-xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 py-24 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm font-semibold mb-6"
          >
            <Building2 className="w-4 h-4" />
            Corporate Tower Lobby
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
            Let's Build <span className="text-gradient-primary">Together</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Step into our tower lobby and connect with us. We're ready to transform 
            your architectural vision into reality.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
          {/* Left: Contact Info as Tower Floors */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Tower structure */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                    className="relative pl-16"
                  >
                    {/* Floor indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
                        <info.icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="bg-card/20 backdrop-blur-xl rounded-2xl p-6 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary-foreground text-lg">
                          {info.label}
                        </h4>
                        <span className="text-xs text-primary font-mono">
                          Floor {info.floor}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {info.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Quote Form - Tower Lobby Style */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="relative bg-card/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-border/30 shadow-2xl overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-primary-foreground">
                      Get a Quote
                    </h3>
                    <p className="text-sm text-muted-foreground">Tower Lobby Reception</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-4 rounded-xl bg-background/50 border-2 transition-all duration-300 outline-none text-foreground placeholder:text-muted-foreground ${
                        focusedField === 'name'
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border/50 hover:border-muted-foreground'
                      }`}
                      required
                    />
                  </motion.div>

                  {/* Email & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-4 rounded-xl bg-background/50 border-2 transition-all duration-300 outline-none text-foreground placeholder:text-muted-foreground ${
                        focusedField === 'email'
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border/50 hover:border-muted-foreground'
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
                      className={`w-full px-5 py-4 rounded-xl bg-background/50 border-2 transition-all duration-300 outline-none text-foreground placeholder:text-muted-foreground ${
                        focusedField === 'phone'
                          ? 'border-secondary shadow-lg shadow-secondary/20'
                          : 'border-border/50 hover:border-muted-foreground'
                      }`}
                    />
                  </div>

                  {/* Project Type */}
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    onFocus={() => setFocusedField('type')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-xl bg-background/50 border-2 transition-all duration-300 outline-none appearance-none cursor-pointer ${
                      focusedField === 'type'
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-border/50 hover:border-muted-foreground'
                    } ${!formData.projectType ? 'text-muted-foreground' : 'text-foreground'}`}
                    required
                  >
                    <option value="">Select Project Type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="text-foreground bg-card">
                        {type}
                      </option>
                    ))}
                  </select>

                  {/* Message */}
                  <textarea
                    placeholder="Tell us about your project vision..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    className={`w-full px-5 py-4 rounded-xl bg-background/50 border-2 transition-all duration-300 outline-none resize-none text-foreground placeholder:text-muted-foreground ${
                      focusedField === 'message'
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-border/50 hover:border-muted-foreground'
                    }`}
                    required
                  />

                  {/* Submit Button */}
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="w-full shadow-2xl shadow-primary/30 hover:shadow-primary/50"
                    type="submit"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TowerContactFloor;
