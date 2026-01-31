import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from './ui/button';

const ContactSection = () => {
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
    // Handle form submission
  };

  const contactInfo = [
    { icon: MapPin, label: 'Visit Us', value: '123 Architecture Ave, Design District' },
    { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567' },
    { icon: Mail, label: 'Email Us', value: 'hello@creativetouch.studio' },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Fri: 9AM - 6PM' },
  ];

  const projectTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Interior Design',
    'Renovation',
    'Consultation',
  ];

  return (
    <section id="contact" className="py-24 bg-background-soft">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Let's Build Something{' '}
              <span className="text-gradient-primary">Extraordinary</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Ready to transform your vision into reality? Whether you're planning 
              a new construction, renovation, or need expert consultation, we're 
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
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{info.label}</h4>
                  <p className="text-sm text-muted-foreground">{info.value}</p>
                </motion.div>
              ))}
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
              className="bg-card rounded-3xl p-8 shadow-card-hover border border-border"
            >
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                Get a Quote
              </h3>

              <div className="space-y-5">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-xl bg-background border-2 transition-all duration-300 outline-none ${
                      focusedField === 'name'
                        ? 'border-primary shadow-md'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-xl bg-background border-2 transition-all duration-300 outline-none ${
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
                    className={`w-full px-5 py-4 rounded-xl bg-background border-2 transition-all duration-300 outline-none ${
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
                  className={`w-full px-5 py-4 rounded-xl bg-background border-2 transition-all duration-300 outline-none appearance-none cursor-pointer ${
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
                  rows={4}
                  className={`w-full px-5 py-4 rounded-xl bg-background border-2 transition-all duration-300 outline-none resize-none ${
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
    </section>
  );
};

export default ContactSection;
