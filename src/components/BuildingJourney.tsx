import { useRef, useCallback } from 'react';
import HeroFloor from './floors/HeroFloor';
import LivingRoomFloor from './floors/LivingRoomFloor';
import VillaGardenFloor from './floors/VillaGardenFloor';
import TowerContactFloor from './floors/TowerContactFloor';

const BuildingJourney = () => {
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollToServices = useCallback(() => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative">
      {/* Floor 1: Hero / Terrace Level */}
      <HeroFloor onScrollToNext={scrollToServices} />

      {/* Floor 2: Living Room (Services) */}
      <div ref={servicesRef}>
        <LivingRoomFloor />
      </div>

      {/* Floor 3: Villa Garden (Portfolio) */}
      <VillaGardenFloor />

      {/* Floor 4: Tower (Contact) */}
      <TowerContactFloor />
    </div>
  );
};

export default BuildingJourney;
