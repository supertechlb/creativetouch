import Navbar from '@/components/Navbar';
import BuildingJourney from '@/components/BuildingJourney';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <BuildingJourney />
      <Footer />
    </main>
  );
};

export default Index;
