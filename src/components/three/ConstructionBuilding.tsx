import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Animated building floor component
const BuildingFloor = ({ 
  position, 
  delay, 
  width = 2, 
  height = 0.3, 
  depth = 2,
  color = '#1e293b'
}: { 
  position: [number, number, number]; 
  delay: number; 
  width?: number; 
  height?: number; 
  depth?: number;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const targetY = position[1];
  const startY = -5;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    progress.current = Math.min(progress.current + delta * 0.5, 1);
    
    const delayedProgress = Math.max(0, (progress.current - delay * 0.1) / (1 - delay * 0.1));
    const eased = 1 - Math.pow(1 - delayedProgress, 3);
    
    meshRef.current.position.y = startY + (targetY - startY) * eased;
    meshRef.current.scale.setScalar(eased);
  });

  return (
    <mesh ref={meshRef} position={[position[0], startY, position[2]]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
    </mesh>
  );
};

// Construction crane
const Crane = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);
  const hookProgress = useRef(0);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
    if (armRef.current) {
      hookProgress.current = (Math.sin(state.clock.elapsedTime * 0.8) + 1) / 2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Crane base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Crane tower */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Crane arm */}
      <mesh ref={armRef} position={[1.5, 3.8, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 0.08, 0.08]} />
        <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Counter weight */}
      <mesh position={[-0.5, 3.8, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.15]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

// Floating construction element
const FloatingElement = ({ 
  position, 
  color = '#f97316',
  size = 0.15
}: { 
  position: [number, number, number]; 
  color?: string;
  size?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.1;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
};

// Main 3D Building Scene
const BuildingScene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1 - 0.2;
    }
  });

  // Building floors configuration
  const floors = [
    { y: 0, color: '#1e293b', delay: 0 },
    { y: 0.5, color: '#334155', delay: 1 },
    { y: 1, color: '#475569', delay: 2 },
    { y: 1.5, color: '#64748b', delay: 3 },
    { y: 2, color: '#94a3b8', delay: 4 },
    { y: 2.5, color: '#cbd5e1', delay: 5 },
  ];

  // Glass panels
  const glassPanels = useMemo(() => {
    const panels: Array<{ pos: [number, number, number]; delay: number }> = [];
    for (let i = 0; i < 6; i++) {
      panels.push({ pos: [1.05, i * 0.5 + 0.15, 0], delay: i + 1 });
      panels.push({ pos: [-1.05, i * 0.5 + 0.15, 0], delay: i + 1.2 });
    }
    return panels;
  }, []);

  // Floating construction elements
  const floatingElements = useMemo(() => [
    { pos: [2.5, 3, 1] as [number, number, number], color: '#f97316' },
    { pos: [-2.5, 2.5, -1] as [number, number, number], color: '#3b82f6' },
    { pos: [1.5, 4, -2] as [number, number, number], color: '#f97316' },
    { pos: [-1.5, 3.5, 2] as [number, number, number], color: '#22c55e' },
    { pos: [0, 4.5, 1.5] as [number, number, number], color: '#f97316' },
  ], []);

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Building floors */}
      {floors.map((floor, i) => (
        <BuildingFloor 
          key={i}
          position={[0, floor.y, 0]}
          delay={floor.delay}
          color={floor.color}
        />
      ))}

      {/* Glass panels */}
      {glassPanels.map((panel, i) => (
        <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.1}>
          <mesh position={panel.pos}>
            <boxGeometry args={[0.05, 0.35, 0.8]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              transparent 
              opacity={0.6}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}

      {/* Crane */}
      <Crane position={[2, 0, 2]} />

      {/* Floating construction elements */}
      {floatingElements.map((el, i) => (
        <FloatingElement key={i} position={el.pos} color={el.color} />
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Ambient particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 6,
            (Math.random() - 0.5) * 10
          ]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Main exported component
const ConstructionBuilding = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-0"
    >
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#f97316" />
        <pointLight position={[5, 3, 5]} intensity={0.3} color="#3b82f6" />
        
        <BuildingScene />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </motion.div>
  );
};

export default ConstructionBuilding;
