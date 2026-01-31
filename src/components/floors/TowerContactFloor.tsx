import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    subtext: 'Mon-Fri 9am-6pm',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@creativetouch.com',
    subtext: 'We respond within 24hrs',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: '123 Architecture Lane',
    subtext: 'New York, NY 10001',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Monday - Friday',
    subtext: '9:00 AM - 6:00 PM',
  },
];

const TowerContactFloor = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section 
      id="contact" 
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Background Image - City Skyline */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/85" />

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
            Start Your{' '}
            <span className="text-primary">Architecture Project</span>
            {' '}Today
          </h2>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Ready to bring your vision to life? Our team of experienced architects 
            and engineers is here to guide you through every step.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white border-0 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Request a Consultation
                </h3>
                <p className="text-slate-600 mb-6">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      Thank You!
                    </h4>
                    <p className="text-slate-600">
                      We've received your message and will contact you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-800 font-semibold">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Smith"
                          required
                          className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-800 font-semibold">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-800 font-semibold">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project" className="text-slate-800 font-semibold">
                          Project Type
                        </Label>
                        <select
                          id="project"
                          className="w-full h-12 px-3 bg-white border-2 border-slate-200 rounded-md text-slate-900 focus:border-primary focus:outline-none"
                        >
                          <option value="">Select project type</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="renovation">Renovation</option>
                          <option value="consulting">Consulting</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-800 font-semibold">
                        Project Details
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                        rows={4}
                        required
                        className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-14 text-lg shadow-xl"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300">
                  <CardContent className="p-5 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-1">
                        {info.label}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {info.value}
                      </p>
                      <p className="text-sm text-slate-400">
                        {info.subtext}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Additional CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="pt-4"
            >
              <Card className="bg-primary border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <h4 className="text-xl font-bold text-white mb-2">
                    Need Urgent Consultation?
                  </h4>
                  <p className="text-white/80 mb-4">
                    Call us directly for immediate assistance with your project.
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-slate-100 font-semibold"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TowerContactFloor;
