import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BuildingInterior from '@/components/BuildingInterior';
import ServicesSection from '@/components/ServicesSection';
import StudioSection from '@/components/StudioSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BuildingInterior />
      <ServicesSection />
      <StudioSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
