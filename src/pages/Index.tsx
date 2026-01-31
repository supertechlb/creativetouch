import Navbar from '@/components/Navbar';
import BuildingInterior from '@/components/BuildingInterior';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BuildingInterior />
      <Footer />
    </main>
  );
};

export default Index;
