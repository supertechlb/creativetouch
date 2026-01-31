import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Building3DProps {
  scrollProgress: number;
}

const Building3D = ({ scrollProgress }: Building3DProps) => {
  const buildingRef = useRef<THREE.Group>(null);
  
  // Building floors that construct as you scroll
  const floors = useMemo(() => {
    const floorData = [];
    const totalFloors = 20;
    
    for (let i = 0; i < totalFloors; i++) {
      floorData.push({
        y: i * 0.25,
        delay: i * 0.05,
        isAccent: i % 5 === 4,
      });
    }
    return floorData;
  }, []);

  useFrame(() => {
    if (buildingRef.current) {
      // Rotate building based on scroll
      buildingRef.current.rotation.y = scrollProgress * Math.PI * 0.5;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 10, -5]} intensity={0.4} color="#b4d4ff" />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Main Building Group */}
      <group ref={buildingRef} position={[0, -2, 0]}>
        {/* Base Platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <cylinderGeometry args={[2.5, 3, 0.2, 64]} />
          <meshStandardMaterial 
            color="#f8f9fa" 
            metalness={0.1} 
            roughness={0.8}
          />
        </mesh>

        {/* Building Floors */}
        {floors.map((floor, index) => {
          const buildProgress = Math.max(0, Math.min(1, (scrollProgress - floor.delay) * 3));
          const scale = buildProgress;
          const opacity = buildProgress;
          
          return (
            <Float 
              key={index}
              speed={1}
              rotationIntensity={0}
              floatIntensity={scrollProgress > 0.1 ? 0.1 : 0}
            >
              <group position={[0, floor.y * scale, 0]} scale={[1, scale, 1]}>
                {/* Main floor block */}
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                  <boxGeometry args={[1.5, 0.22, 1.5]} />
                  <meshStandardMaterial 
                    color={floor.isAccent ? "#3182CE" : "#e2e8f0"}
                    metalness={0.3}
                    roughness={0.4}
                    transparent
                    opacity={opacity}
                  />
                </mesh>
                
                {/* Glass windows */}
                {!floor.isAccent && (
                  <>
                    <mesh position={[0.76, 0, 0]}>
                      <boxGeometry args={[0.02, 0.18, 1.2]} />
                      <meshPhysicalMaterial 
                        color="#87CEEB"
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={opacity * 0.6}
                        transmission={0.5}
                      />
                    </mesh>
                    <mesh position={[-0.76, 0, 0]}>
                      <boxGeometry args={[0.02, 0.18, 1.2]} />
                      <meshPhysicalMaterial 
                        color="#87CEEB"
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={opacity * 0.6}
                        transmission={0.5}
                      />
                    </mesh>
                    <mesh position={[0, 0, 0.76]}>
                      <boxGeometry args={[1.2, 0.18, 0.02]} />
                      <meshPhysicalMaterial 
                        color="#87CEEB"
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={opacity * 0.6}
                        transmission={0.5}
                      />
                    </mesh>
                    <mesh position={[0, 0, -0.76]}>
                      <boxGeometry args={[1.2, 0.18, 0.02]} />
                      <meshPhysicalMaterial 
                        color="#87CEEB"
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={opacity * 0.6}
                        transmission={0.5}
                      />
                    </mesh>
                  </>
                )}

                {/* Orange accent pillars at corners */}
                {floor.isAccent && (
                  <>
                    {[[-0.7, 0, -0.7], [0.7, 0, -0.7], [-0.7, 0, 0.7], [0.7, 0, 0.7]].map((pos, i) => (
                      <mesh key={i} position={pos as [number, number, number]} castShadow>
                        <boxGeometry args={[0.1, 0.25, 0.1]} />
                        <meshStandardMaterial 
                          color="#ED8936"
                          metalness={0.5}
                          roughness={0.3}
                          transparent
                          opacity={opacity}
                        />
                      </mesh>
                    ))}
                  </>
                )}
              </group>
            </Float>
          );
        })}

        {/* Crown/Top of building */}
        {scrollProgress > 0.7 && (
          <Float speed={2} floatIntensity={0.2}>
            <mesh 
              castShadow 
              position={[0, floors.length * 0.25 * Math.min(1, (scrollProgress - 0.7) * 5), 0]}
              scale={Math.min(1, (scrollProgress - 0.7) * 5)}
            >
              <coneGeometry args={[0.8, 0.8, 4]} />
              <meshStandardMaterial 
                color="#ED8936"
                metalness={0.6}
                roughness={0.2}
                transparent
                opacity={Math.min(1, (scrollProgress - 0.7) * 5)}
              />
            </mesh>
          </Float>
        )}
      </group>

      {/* Ground Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#f8f9fa"
          metalness={0.1}
          mirror={0.5}
        />
      </mesh>
    </>
  );
};

export default Building3D;
