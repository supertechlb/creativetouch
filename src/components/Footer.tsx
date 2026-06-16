import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = {
    company: [
      { label: t('navbar.home'), href: '#home' },
      { label: t('split.engineering.cta'), href: '#services' },
      { label: t('split.studio.cta'), href: '#decor-builder' },
      { label: t('navbar.contact'), href: '#contact' },
    ],
    services: [
      { label: t('services.architectural.title'), href: '#services' },
      { label: t('services.structural.title'), href: '#services' },
      { label: t('services.renovation.title'), href: '#services' },
      { label: t('services.consulting.title'), href: '#services' },
    ],
    resources: [
      { label: t('builder.title'), href: '#decor-builder' },
      { label: t('portfolio.title'), href: '#studio' },
      { label: t('navbar.get_quote'), href: '#contact' },
    ],
  };

  const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 text-start">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Creative Touch" className="h-12 w-auto" />
              <span className="font-display text-xl font-semibold text-white">
                Creative Touch
              </span>
            </a>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed text-sm">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              {socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary hover:text-white flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-primary">{t('split.title')}</h4>
            <ul className="space-y-3 text-sm">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-primary">{t('footer.services')}</h4>
            <ul className="space-y-3 text-sm">
              {links.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-primary">{t('footer.quick')}</h4>
            <ul className="space-y-3 text-sm">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Creative Touch. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg text-white"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
