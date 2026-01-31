import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Animated building floor component with looping
const BuildingFloor = ({ 
  position, 
  floorIndex, 
  width = 1.8, 
  height = 0.25, 
  depth = 1.8,
  color = '#374151'
}: { 
  position: [number, number, number]; 
  floorIndex: number; 
  width?: number; 
  height?: number; 
  depth?: number;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetY = position[1];
  const startY = -3;

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // 8-second loop: 0-4s rise, 4-6s hold, 6-8s fall
    const cycleTime = state.clock.elapsedTime % 8;
    const delay = floorIndex * 0.3;
    
    let progress = 0;
    if (cycleTime < 4) {
      // Rising phase
      const adjustedTime = Math.max(0, cycleTime - delay);
      progress = Math.min(1, adjustedTime / (2 - delay * 0.3));
    } else if (cycleTime < 6) {
      // Hold phase
      progress = 1;
    } else {
      // Falling phase
      const fallTime = cycleTime - 6;
      const adjustedFall = Math.max(0, fallTime - (5 - floorIndex) * 0.15);
      progress = Math.max(0, 1 - adjustedFall / 1.5);
    }
    
    const eased = 1 - Math.pow(1 - progress, 3);
    meshRef.current.position.y = startY + (targetY - startY) * eased;
    meshRef.current.scale.setScalar(Math.max(0.01, eased));
  });

  return (
    <mesh ref={meshRef} position={[position[0], startY, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
    </mesh>
  );
};

// Construction crane with looping animation
const Crane = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Mesh>(null);
  const cableRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4;
    }
    if (hookRef.current && cableRef.current) {
      const hookY = Math.sin(state.clock.elapsedTime * 0.8) * 0.3 + 0.5;
      hookRef.current.position.y = 3.2 - hookY;
      cableRef.current.scale.y = hookY + 0.3;
      cableRef.current.position.y = 3.5 - hookY / 2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Crane base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.3, 8]} />
        <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Crane tower */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.12, 4, 0.12]} />
        <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Crane arm */}
      <mesh position={[1.2, 3.85, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Counter weight */}
      <mesh position={[-0.4, 3.85, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Cable */}
      <mesh ref={cableRef} position={[1.8, 3.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Hook */}
      <mesh ref={hookRef} position={[1.8, 3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

// Scaffolding element
const Scaffolding = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const cycleTime = state.clock.elapsedTime % 8;
      const visible = cycleTime > 0.5 && cycleTime < 6.5;
      groupRef.current.visible = visible;
      if (visible) {
        groupRef.current.scale.setScalar(Math.min(1, (cycleTime - 0.5) * 2));
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Vertical poles */}
      {[[-0.2, 0, -0.2], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2, 6]} />
          <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Horizontal bars */}
      {[0.5, 1, 1.5].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh position={[0, 0, -0.2]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0, 0, 0.2]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Floating orange accent cube
const FloatingAccent = ({ 
  position, 
  size = 0.1 
}: { 
  position: [number, number, number]; 
  size?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + offset) * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial 
        color="#f97316" 
        metalness={0.8} 
        roughness={0.2} 
        emissive="#f97316" 
        emissiveIntensity={0.4} 
      />
    </mesh>
  );
};

// Main 3D Building Scene
const BuildingScene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15 - 0.3;
    }
  });

  // Building floors configuration - modern office building look
  const floors = [
    { y: 0, color: '#1f2937' },
    { y: 0.35, color: '#374151' },
    { y: 0.7, color: '#4b5563' },
    { y: 1.05, color: '#6b7280' },
    { y: 1.4, color: '#9ca3af' },
    { y: 1.75, color: '#d1d5db' },
  ];

  // Window panels
  const windowPanels = useMemo(() => {
    const panels: Array<{ pos: [number, number, number]; floorIndex: number }> = [];
    for (let i = 0; i < 6; i++) {
      // Front and back windows
      panels.push({ pos: [0, i * 0.35 + 0.1, 0.92], floorIndex: i });
      panels.push({ pos: [0, i * 0.35 + 0.1, -0.92], floorIndex: i });
      // Side windows
      panels.push({ pos: [0.92, i * 0.35 + 0.1, 0], floorIndex: i });
      panels.push({ pos: [-0.92, i * 0.35 + 0.1, 0], floorIndex: i });
    }
    return panels;
  }, []);

  // Floating accent positions
  const accents = useMemo(() => [
    { pos: [2, 2.5, 1] as [number, number, number], size: 0.12 },
    { pos: [-2, 1.8, -1] as [number, number, number], size: 0.1 },
    { pos: [1.5, 3, -1.5] as [number, number, number], size: 0.08 },
    { pos: [-1.5, 2.2, 1.5] as [number, number, number], size: 0.14 },
    { pos: [0, 3.2, 2] as [number, number, number], size: 0.1 },
    { pos: [2.5, 1.5, 0] as [number, number, number], size: 0.09 },
  ], []);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Building floors */}
      {floors.map((floor, i) => (
        <BuildingFloor 
          key={i}
          position={[0, floor.y, 0]}
          floorIndex={i}
          color={floor.color}
        />
      ))}

      {/* Window panels */}
      {windowPanels.map((panel, i) => (
        <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.05}>
          <mesh position={panel.pos}>
            <boxGeometry args={[
              panel.pos[2] !== 0 ? 0.6 : 0.04,
              0.2,
              panel.pos[2] !== 0 ? 0.04 : 0.6
            ]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              transparent 
              opacity={0.7}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}

      {/* Crane */}
      <Crane position={[1.8, 0, 1.5]} />

      {/* Scaffolding */}
      <Scaffolding position={[-1.2, 0.5, 1.1]} />

      {/* Floating orange accents */}
      {accents.map((accent, i) => (
        <FloatingAccent key={i} position={accent.pos} size={accent.size} />
      ))}

      {/* Ambient particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Float key={i} speed={0.8 + Math.random() * 0.5} rotationIntensity={0} floatIntensity={0.3}>
          <mesh position={[
            (Math.random() - 0.5) * 6,
            Math.random() * 4 + 0.5,
            (Math.random() - 0.5) * 6
          ]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial 
              color="#f97316" 
              emissive="#f97316" 
              emissiveIntensity={0.6} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Main exported component
const ConstructionBuilding = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [4, 2.5, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[8, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 4, -3]} intensity={0.4} color="#f97316" />
        <pointLight position={[3, 2, 3]} intensity={0.3} color="#3b82f6" />
        
        <BuildingScene />
        
        {/* Soft shadow on white ground */}
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.4} 
          scale={12} 
          blur={2.5} 
          far={6}
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3.5}
        />
      </Canvas>
    </div>
  );
};

export default ConstructionBuilding;
