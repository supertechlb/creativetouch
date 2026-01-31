import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Building3D from './Building3D';

interface HeroSceneProps {
  scrollProgress: number;
}

const HeroScene = ({ scrollProgress }: HeroSceneProps) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={[5, 3, 5]} 
            fov={45}
          />
          <Building3D scrollProgress={scrollProgress} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
