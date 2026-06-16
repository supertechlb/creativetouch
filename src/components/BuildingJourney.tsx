import { useRef, useCallback } from 'react';
import HeroFloor from './floors/HeroFloor';
import ServicesSplit from './ServicesSplit';
import LivingRoomFloor from './floors/LivingRoomFloor';
import DecorBuilder from './DecorBuilder';
import VillaGardenFloor from './floors/VillaGardenFloor';
import TowerContactFloor from './floors/TowerContactFloor';

const BuildingJourney = () => {
  const splitRef = useRef<HTMLDivElement>(null);

  const scrollToSplit = useCallback(() => {
    splitRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative">
      {/* Level 1: Hero / Entrance */}
      <HeroFloor onScrollToNext={scrollToSplit} />

      {/* Level 2: Business Split (Engineering vs. Studio) */}
      <div ref={splitRef}>
        <ServicesSplit />
      </div>

      {/* Level 3: Detailed Engineering Services */}
      <LivingRoomFloor />

      {/* Level 4: Design Studio - Interactive Decor Builder (HIDDEN) */}
      {/* <DecorBuilder /> */}

      {/* Level 5: Featured Projects Portfolio */}
      <VillaGardenFloor />

      {/* Level 6: Contact & Consultation */}
      <TowerContactFloor />
    </div>
  );
};

export default BuildingJourney;
