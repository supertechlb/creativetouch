import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleLangChange = () => {
      const lng = i18n.language || 'en';
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };
    handleLangChange();
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  const navLinks = [
    { label: t('navbar.home'), href: '#home' },
    { label: t('navbar.services'), href: '#services' },
    { label: t('navbar.studio'), href: '#studio' },
    { label: t('navbar.contact'), href: '#contact' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
  ];

  const activeLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl bg-white/75 border-b border-slate-200/40 py-3.5 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="Creative Touch" className="h-12 w-auto" />
          <span className={`font-display text-xl font-semibold hidden sm:block transition-colors duration-500 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
            Creative Touch
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition-colors duration-300 font-semibold text-[11px] uppercase tracking-widest ${
                isScrolled
                  ? 'text-slate-600 hover:text-slate-950'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-[11px] font-semibold uppercase tracking-widest outline-none ${
                isScrolled
                  ? 'border-slate-200 bg-slate-100/80 hover:bg-slate-200 text-slate-800'
                  : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{activeLang.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <>
                  {/* Backdrop to close */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-40 rounded-xl bg-white border border-border shadow-xl p-1.5 z-20"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors font-semibold uppercase tracking-wider ${
                          i18n.language === lang.code
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-slate-850 hover:bg-slate-105'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {i18n.language === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* HIDDEN FOR NOW
          <Button
            variant="outline"
            className={`font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 h-10 ${
              isScrolled
                ? 'border-primary/50 text-primary hover:bg-primary hover:text-white'
                : 'border-white/30 text-white bg-white/5 hover:bg-white hover:text-slate-950 hover:border-white'
            }`}
            size="sm"
            asChild
          >
            <a href="/customize" target="_blank" rel="noopener noreferrer">{t('navbar.customize')}</a>
          </Button>
          */}

          <Button
            variant="hero"
            className="text-[11px] uppercase tracking-widest h-10 font-bold"
            size="sm"
            asChild
          >
            <a href="#contact">{t('navbar.get_quote')}</a>
          </Button>
        </div>

        {/* Mobile Menu & Language Toggle button */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Quick Mobile Language Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="p-2 rounded-lg border border-border bg-white/40 text-foreground"
            >
              <Globe size={18} />
            </button>
            <AnimatePresence>
              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-32 rounded-xl bg-white border border-border shadow-xl p-1 z-20"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="w-full text-left rtl:text-right px-3 py-2 text-xs rounded-lg text-foreground hover:bg-muted"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card-strong border-t border-border"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground py-2 font-medium text-lg border-b border-border/50"
                >
                  {link.label}
                </a>
              ))}
              {/* HIDDEN FOR NOW
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white w-full" size="lg" asChild>
                <a href="/customize" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.customize')}</a>
              </Button>
              */}
              <Button variant="hero" size="lg" className="w-full" asChild>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.get_quote')}</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
