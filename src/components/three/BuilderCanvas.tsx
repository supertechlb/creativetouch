import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useBuilderStore } from '../../stores/useBuilderStore';
import { Wall, Floor, Furniture } from './RoomElements';

export const BuilderCanvas = () => {
  const { walls, floors, furniture, viewMode, setSelectedId } = useBuilderStore();

  const handlePointerMissed = () => {
    setSelectedId(null);
  };

  return (
    <div className="w-full h-full bg-neutral-100">
      <Canvas shadows onPointerMissed={handlePointerMissed}>
        <Suspense fallback={null}>
          {viewMode === '3d' ? (
            <PerspectiveCamera makeDefault position={[5, 6, 8]} fov={50} />
          ) : (
            <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={60} rotation={[-Math.PI / 2, 0, 0]} />
          )}

          <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            maxPolarAngle={viewMode === '3d' ? Math.PI / 2 - 0.05 : 0} 
            minPolarAngle={viewMode === '3d' ? 0 : 0} 
            enableRotate={viewMode === '3d'}
          />
          
          <ambientLight intensity={0.4} />
          <directionalLight castShadow position={[10, 15, 10]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
          <Environment preset="apartment" background blur={0.5} />

          <Grid
            infiniteGrid
            fadeDistance={30}
            sectionColor="#94a3b8"
            cellColor="#cbd5e1"
            position={[0, -0.01, 0]}
          />

          <group>
            {floors.map((floor) => (
              <Floor key={floor.id} floor={floor} />
            ))}
            {walls.map((wall) => (
              <Wall key={wall.id} wall={wall} />
            ))}
            {furniture.map((item) => (
              <Furniture key={item.id} item={item} />
            ))}
          </group>

          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
};
