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
import { useTranslation } from 'react-i18next';
import { supabaseMock } from '../../lib/supabaseMock';

const TowerContactFloor = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: t('contact.info.phone_val'),
      subtext: t('contact.info.phone_sub'),
    },
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: t('contact.info.email_val'),
      subtext: t('contact.info.email_sub'),
    },
    {
      icon: MapPin,
      label: t('contact.info.office'),
      value: t('contact.info.office_val'),
      subtext: t('contact.info.office_sub'),
    },
    {
      icon: Clock,
      label: t('contact.info.hours'),
      value: t('contact.info.hours_val'),
      subtext: t('contact.info.hours_sub'),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = (document.getElementById('name') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value || '';
    const projectType = (document.getElementById('project') as HTMLSelectElement)?.value || '';
    const details = (document.getElementById('message') as HTMLTextAreaElement)?.value || '';

    await supabaseMock.from('consultation_requests').insert({
      name,
      email,
      phone,
      projectType,
      details
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section 
      id="contact" 
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden text-start"
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
            {t('contact.title')}
          </h2>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            {t('contact.desc')}
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
                  {t('contact.form.title')}
                </h3>
                <p className="text-slate-600 mb-6">
                  {t('contact.form.desc')}
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {t('contact.form.success')}
                    </h4>
                    <p className="text-slate-600">
                      {t('contact.form.success_desc')}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-800 font-semibold">
                          {t('contact.form.name')}
                        </Label>
                        <Input
                          id="name"
                          placeholder={t('contact.form.name_placeholder')}
                          required
                          className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-800 font-semibold">
                          {t('contact.form.email')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('contact.form.email_placeholder')}
                          required
                          className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-800 font-semibold">
                          {t('contact.form.phone')}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t('contact.form.phone_placeholder')}
                          className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project" className="text-slate-800 font-semibold">
                          {t('contact.form.type')}
                        </Label>
                        <select
                          id="project"
                          className="w-full h-12 px-3 bg-white border-2 border-slate-200 rounded-md text-slate-900 focus:border-primary focus:outline-none"
                          required
                        >
                          <option value="">{t('contact.form.select_type')}</option>
                          <option value="residential">{t('contact.form.type_residential')}</option>
                          <option value="commercial">{t('contact.form.type_commercial')}</option>
                          <option value="renovation">{t('contact.form.type_renovation')}</option>
                          <option value="consulting">{t('contact.form.type_consulting')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-800 font-semibold">
                        {t('contact.form.details')}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t('contact.form.details_placeholder')}
                        rows={4}
                        required
                        className="bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold h-14 text-lg shadow-xl"
                    >
                      <Send className="w-5 h-5 me-2" />
                      {t('contact.form.send')}
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
                      <p className="text-lg font-bold text-white leading-snug">
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
                    {t('contact.info.urgent_title')}
                  </h4>
                  <p className="text-white/80 mb-4">
                    {t('contact.info.urgent_desc')}
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-slate-100 font-semibold"
                    asChild
                  >
                    <a href={`tel:${t('contact.info.phone_val')}`}>
                      <Phone className="w-5 h-5 me-2" />
                      {t('contact.info.call_now')}
                    </a>
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
