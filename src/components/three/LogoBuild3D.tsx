import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

// --- ANIMATION CONFIG ---
const ANIM_DURATION = 1.2;
const RESTART_DELAY = 7;

// --- HELPER: CONSTRUCTION PIECE ---
const ConstructionPiece = ({ 
  children, 
  delay = 0, 
  from = [0, 10, 0] as [number, number, number],
  scaleAnim = false 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  from?: [number, number, number];
  scaleAnim?: boolean;
}) => {
  const group = useRef<THREE.Group>(null);
  const startVec = new THREE.Vector3(...from);

  useFrame(({ clock }) => {
    if (!group.current) return;
    
    const t = clock.getElapsedTime() % RESTART_DELAY;
    let progress = Math.max(0, Math.min(1, (t - delay) / ANIM_DURATION));
    
    // Elastic ease out
    const ease = (x: number) => {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    };
    const val = ease(progress);

    group.current.position.lerpVectors(startVec, new THREE.Vector3(0, 0, 0), val);

    if (scaleAnim) {
      group.current.scale.setScalar(Math.max(0.001, val));
    }
    
    group.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'opacity' in mesh.material) {
          (mesh.material as THREE.MeshPhysicalMaterial).transparent = true;
          (mesh.material as THREE.MeshPhysicalMaterial).opacity = Math.max(0, Math.min(1, progress * 2.5));
        }
      }
    });
  });

  return <group ref={group}>{children}</group>;
};

// --- FEATHER FACET (Single polygon) ---
const FeatherFacet = ({ 
  color, 
  position, 
  rotation, 
  scale,
  flipX = false
}: { 
  color: string; 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  scale: [number, number, number];
  flipX?: boolean;
}) => {
  return (
    <mesh 
      castShadow 
      position={position} 
      rotation={rotation}
      scale={[flipX ? -scale[0] : scale[0], scale[1], scale[2]]}
    >
      <coneGeometry args={[0.5, 1.0, 3]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.35} 
        metalness={0.0}
        flatShading={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// --- PART 1: THE FEATHER (Left) - Low-poly style matching logo ---
const Feather = () => {
  // Facets arranged to create overlapping polygon feather effect
  // Each row has left and right facets that overlap
  const facets = [
    // Top - Magenta/Pink
    { color: '#e946ef', pos: [0.3, 2.4, 0], rot: [0, 0, 0.6], scale: [0.5, 0.6, 0.15] },
    { color: '#d946ef', pos: [0.5, 2.1, 0], rot: [0, 0, 0.4], scale: [0.45, 0.5, 0.15] },
    
    // Upper - Cyan
    { color: '#06b6d4', pos: [0.0, 1.9, 0], rot: [0, 0, 0.4], scale: [0.6, 0.7, 0.15] },
    { color: '#22d3ee', pos: [0.25, 1.55, 0], rot: [0, 0, 0.25], scale: [0.55, 0.65, 0.15] },
    { color: '#0ea5e9', pos: [-0.1, 1.5, 0], rot: [0, 0, 0.35], scale: [0.5, 0.55, 0.15] },
    
    // Middle - Teal/Turquoise  
    { color: '#14b8a6', pos: [-0.2, 1.1, 0], rot: [0, 0, 0.2], scale: [0.65, 0.75, 0.15] },
    { color: '#2dd4bf', pos: [0.05, 0.9, 0], rot: [0, 0, 0.1], scale: [0.6, 0.7, 0.15] },
    { color: '#5eead4', pos: [-0.35, 0.65, 0], rot: [0, 0, 0.15], scale: [0.55, 0.6, 0.15] },
    
    // Lower middle - Orange/Yellow
    { color: '#fbbf24', pos: [-0.25, 0.35, 0], rot: [0, 0, 0], scale: [0.7, 0.8, 0.15] },
    { color: '#f97316', pos: [0.0, 0.05, 0], rot: [0, 0, -0.1], scale: [0.65, 0.75, 0.15] },
    { color: '#fb923c', pos: [-0.35, -0.15, 0], rot: [0, 0, 0.05], scale: [0.55, 0.6, 0.15] },
    
    // Bottom - Red
    { color: '#ef4444', pos: [-0.1, -0.5, 0], rot: [0, 0, -0.2], scale: [0.6, 0.7, 0.15] },
    { color: '#f87171', pos: [0.15, -0.85, 0], rot: [0, 0, -0.3], scale: [0.5, 0.6, 0.15] },
    { color: '#dc2626', pos: [-0.15, -1.0, 0], rot: [0, 0, -0.15], scale: [0.45, 0.5, 0.15] },
    
    // Tip - Dark red
    { color: '#b91c1c', pos: [0.25, -1.4, 0], rot: [0, 0, -0.45], scale: [0.4, 0.45, 0.15] },
  ];

  return (
    <group position={[-2.5, 0.2, 0]}>
      {facets.map((facet, i) => (
        <ConstructionPiece 
          key={i} 
          delay={0.08 + i * 0.06} 
          from={[-3 - Math.random(), (2 - i * 0.3) + Math.random() * 2, 0]} 
          scaleAnim
        >
          <FeatherFacet
            color={facet.color}
            position={facet.pos as [number, number, number]}
            rotation={facet.rot as [number, number, number]}
            scale={facet.scale as [number, number, number]}
          />
        </ConstructionPiece>
      ))}
      {/* Quill stem */}
      <ConstructionPiece delay={1.0} from={[0, -6, 0]}>
        <mesh position={[0.35, -1.9, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.04, 0.02, 1.2, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- PART 2: THE ORANGE BUILDING (Center) ---
const OrangeBuilding = () => {
  // Gradient from yellow (top) to orange (bottom)
  const slotColors = ['#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff7700', '#ff6600', '#ff5500'];
  
  return (
    <group position={[0, 0, 0]}>
      {/* Main tapered building body */}
      <ConstructionPiece delay={0.3} from={[0, 8, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          {/* Using a custom shape - tapered box */}
          <cylinderGeometry args={[0.9, 1.2, 5.5, 4]} />
          <meshPhysicalMaterial 
            color="#ff8c00" 
            roughness={0.25} 
            metalness={0.1}
            clearcoat={0.6}
          />
        </mesh>
        {/* Yellow top cap */}
        <mesh castShadow position={[0, 2.9, 0]}>
          <boxGeometry args={[0.6, 0.3, 0.6]} />
          <meshPhysicalMaterial color="#ffc107" roughness={0.3} />
        </mesh>
      </ConstructionPiece>

      {/* White horizontal slots */}
      {[-1.8, -1.1, -0.4, 0.3, 1.0, 1.7, 2.3].map((y, i) => (
        <ConstructionPiece key={i} delay={0.7 + i * 0.08} from={[0, 0, 4]} scaleAnim>
          <mesh position={[0, y, 0.7]}>
            <boxGeometry args={[1.4 - Math.abs(y) * 0.08, 0.18, 0.12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </ConstructionPiece>
      ))}
    </group>
  );
};

// --- PART 3: THE BLUE CURVED TOWER (Right) ---
const BlueTower = () => {
  return (
    <group position={[0.6, 0, -0.2]}>
      {/* Base with vertical pillars - positioned closer to building */}
      <group position={[1.0, -2.4, 0]}>
        {/* Bottom horizontal bar */}
        <ConstructionPiece delay={0.2} from={[4, -3, 0]}>
          <mesh position={[0.2, -0.6, 0]}>
            <boxGeometry args={[2.4, 0.3, 0.25]} />
            <meshPhysicalMaterial color="#2563eb" roughness={0.2} clearcoat={0.8} />
          </mesh>
        </ConstructionPiece>
        
        {/* Vertical pillars - tighter arrangement */}
        {[
          { x: -0.8, h: 2.0 },
          { x: -0.3, h: 2.4 },
          { x: 0.2, h: 2.8 },
          { x: 0.7, h: 3.2 },
          { x: 1.2, h: 3.6 },
        ].map((pillar, i) => (
          <ConstructionPiece key={i} delay={0.3 + i * 0.1} from={[3, -4, 0]}>
            <mesh position={[pillar.x, pillar.h / 2 - 0.4, 0]} castShadow>
              <boxGeometry args={[0.18, pillar.h, 0.18]} />
              <meshPhysicalMaterial color="#2563eb" roughness={0.2} clearcoat={0.8} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Curved arcs - positioned to wrap around the orange building */}
      <group position={[-1.2, -0.8, 0]}>
        {[
          { radius: 2.0, tube: 0.16, color: '#1d4ed8', yOffset: 0 },
          { radius: 2.5, tube: 0.14, color: '#2563eb', yOffset: 0.1 },
          { radius: 3.0, tube: 0.12, color: '#3b82f6', yOffset: 0.2 },
          { radius: 3.5, tube: 0.10, color: '#60a5fa', yOffset: 0.3 },
        ].map((arc, i) => (
          <ConstructionPiece key={i} delay={1.2 + i * 0.12} from={[3, 3, 0]} scaleAnim>
            <mesh rotation={[0, 0, -0.15]} position={[0, arc.yOffset, 0]}>
              <torusGeometry args={[arc.radius, arc.tube, 16, 48, Math.PI * 0.52]} />
              <meshPhysicalMaterial 
                color={arc.color} 
                roughness={0.2} 
                clearcoat={0.8}
              />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Top curved piece wrapping tightly around the building top */}
      <ConstructionPiece delay={1.7} from={[2, 3, 0]} scaleAnim>
        <group position={[-1.4, 2.2, 0]}>
          <mesh rotation={[0, 0, -0.25]}>
            <torusGeometry args={[1.6, 0.18, 16, 32, Math.PI * 0.4]} />
            <meshPhysicalMaterial color="#1e40af" roughness={0.2} clearcoat={0.9} />
          </mesh>
        </group>
      </ConstructionPiece>
    </group>
  );
};

// --- MAIN SCENE ---
const LogoBuild3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 12], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 4, -4]} intensity={0.4} />
        <spotLight position={[0, 10, 5]} intensity={0.6} color="#fff5e6" />

        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.15}>
          <Center>
            <group scale={0.75} position={[0, 0.2, 0]}>
              <Feather />
              <OrangeBuilding />
              <BlueTower />
            </group>
          </Center>
        </Float>

        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.4}
          scale={15}
          blur={2}
          far={5}
        />
      </Canvas>
    </div>
  );
};

export default LogoBuild3D;
