import React, { useRef, useMemo } from 'react';
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

// --- FEATHER FACET (Flat triangle matching logo) ---
const FeatherFacet = ({ 
  color, 
  position, 
  rotation, 
  scale,
}: { 
  color: string; 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  scale: [number, number, number];
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Flat triangle using cone with 3 radial segments */}
      <mesh castShadow scale={scale}>
        <coneGeometry args={[0.5, 1.0, 3]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.35} 
          metalness={0.0}
          flatShading={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// --- PART 1: THE FEATHER (Left) - Flat low-poly triangles in S-curve ---
const Feather = () => {
  // Flat triangular facets arranged in S-curve matching the logo
  const facets = [
    // Top tip - Magenta/Pink
    { color: '#e040fb', pos: [0.4, 2.5, 0], rot: [0, 0, 0.6], scale: [0.3, 0.5, 0.08] },
    { color: '#d946ef', pos: [0.15, 2.15, 0], rot: [0, 0, 0.4], scale: [0.38, 0.6, 0.08] },
    
    // Upper section - Cyan
    { color: '#22d3ee', pos: [-0.1, 1.8, 0], rot: [0, 0, 0.25], scale: [0.45, 0.7, 0.08] },
    { color: '#06b6d4', pos: [0.12, 1.45, 0], rot: [0, 0, 0.15], scale: [0.42, 0.65, 0.08] },
    { color: '#22d3ee', pos: [-0.25, 1.35, 0], rot: [0, 0, 0.3], scale: [0.38, 0.55, 0.08] },
    
    // Middle section - Teal (widest part)
    { color: '#14b8a6', pos: [-0.35, 0.95, 0], rot: [0, 0, 0.12], scale: [0.52, 0.75, 0.08] },
    { color: '#2dd4bf', pos: [0.0, 0.7, 0], rot: [0, 0, 0.05], scale: [0.48, 0.7, 0.08] },
    { color: '#14b8a6', pos: [-0.38, 0.45, 0], rot: [0, 0, 0.08], scale: [0.45, 0.6, 0.08] },
    { color: '#2dd4bf', pos: [-0.1, 0.2, 0], rot: [0, 0, 0.0], scale: [0.5, 0.68, 0.08] },
    
    // Lower section - Orange/Yellow
    { color: '#f59e0b', pos: [-0.28, -0.15, 0], rot: [0, 0, -0.08], scale: [0.52, 0.7, 0.08] },
    { color: '#fbbf24', pos: [0.05, -0.45, 0], rot: [0, 0, -0.15], scale: [0.48, 0.65, 0.08] },
    { color: '#f59e0b', pos: [-0.2, -0.75, 0], rot: [0, 0, -0.1], scale: [0.44, 0.58, 0.08] },
    
    // Bottom section - Red
    { color: '#ef4444', pos: [0.1, -1.05, 0], rot: [0, 0, -0.22], scale: [0.48, 0.62, 0.08] },
    { color: '#dc2626', pos: [-0.08, -1.35, 0], rot: [0, 0, -0.28], scale: [0.42, 0.55, 0.08] },
    { color: '#ef4444', pos: [0.18, -1.65, 0], rot: [0, 0, -0.38], scale: [0.35, 0.48, 0.08] },
    
    // Tip - Dark red
    { color: '#b91c1c', pos: [0.38, -1.95, 0], rot: [0, 0, -0.5], scale: [0.28, 0.4, 0.08] },
  ];

  return (
    <group position={[-2.4, 0.1, 0]}>
      {facets.map((facet, i) => (
        <ConstructionPiece 
          key={i} 
          delay={0.05 + i * 0.04} 
          from={[-2 - Math.random() * 2, 3 - i * 0.15, Math.random() - 0.5]} 
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
      {/* Quill stem - white curved line */}
      <ConstructionPiece delay={0.85} from={[0, -5, 0]}>
        <mesh position={[0.55, -2.4, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.03, 0.012, 1.1, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- PART 2: THE ORANGE BUILDING (Center) - Smooth tapered tower ---
const OrangeBuilding = () => {
  // Smoother gradient segments with overlapping heights
  const segments = [
    { y: -2.0, w: 1.35, h: 1.0, color: '#ea580c' },
    { y: -1.1, w: 1.28, h: 0.9, color: '#f97316' },
    { y: -0.3, w: 1.2, h: 0.8, color: '#fb923c' },
    { y: 0.4, w: 1.1, h: 0.7, color: '#fdba74' },
    { y: 1.0, w: 1.0, h: 0.6, color: '#fbbf24' },
    { y: 1.5, w: 0.88, h: 0.5, color: '#fcd34d' },
    { y: 1.95, w: 0.7, h: 0.4, color: '#fde68a' },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Main building body - smooth tapered segments */}
      <ConstructionPiece delay={0.3} from={[0, 8, 0]}>
        {segments.map((seg, i) => (
          <mesh key={i} castShadow position={[0, seg.y, 0]}>
            <boxGeometry args={[seg.w, seg.h, 0.45]} />
            <meshStandardMaterial color={seg.color} roughness={0.3} />
          </mesh>
        ))}
        {/* Stepped crown top */}
        <mesh castShadow position={[0, 2.35, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.35]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 2.65, 0]}>
          <boxGeometry args={[0.28, 0.25, 0.25]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.3} />
        </mesh>
      </ConstructionPiece>

      {/* White horizontal slots - evenly spaced */}
      {[
        { y: -2.35, w: 1.38 },
        { y: -1.55, w: 1.32 },
        { y: -0.75, w: 1.25 },
        { y: 0.0, w: 1.18 },
        { y: 0.65, w: 1.08 },
        { y: 1.25, w: 0.95 },
        { y: 1.72, w: 0.8 },
        { y: 2.12, w: 0.6 },
      ].map((slot, i) => (
        <ConstructionPiece key={i} delay={0.55 + i * 0.05} from={[0, 0, 3]} scaleAnim>
          <mesh position={[0, slot.y, 0.24]}>
            <boxGeometry args={[slot.w, 0.1, 0.05]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </ConstructionPiece>
      ))}
    </group>
  );
};

// --- PART 3: THE BLUE CURVED STRUCTURE (Right) - Connected arc system ---
const BlueTower = () => {
  return (
    <group position={[0.35, 0, 0]}>
      {/* Base structure with pillars */}
      <group position={[0.9, -2.3, 0]}>
        {/* Curved base connecting pillars */}
        <ConstructionPiece delay={0.12} from={[4, -3, 0]}>
          <mesh position={[0.4, -0.55, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[1.1, 0.12, 8, 32, Math.PI * 0.48]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.25} />
          </mesh>
        </ConstructionPiece>
        
        {/* Vertical pillars - connected to base, increasing heights */}
        {[
          { x: -0.5, h: 1.5 },
          { x: -0.05, h: 1.9 },
          { x: 0.4, h: 2.35 },
          { x: 0.85, h: 2.8 },
          { x: 1.3, h: 3.3 },
        ].map((pillar, i) => (
          <ConstructionPiece key={i} delay={0.18 + i * 0.07} from={[3, -4, 0]}>
            <mesh position={[pillar.x, pillar.h / 2 - 0.4, 0]} castShadow>
              <boxGeometry args={[0.12, pillar.h, 0.12]} />
              <meshStandardMaterial color="#2563eb" roughness={0.25} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Curved arcs wrapping tightly around building - originating from behind */}
      <group position={[-0.9, -0.3, -0.08]}>
        {[
          { radius: 1.9, tube: 0.13, color: '#1e3a8a', angle: Math.PI * 0.58, rotZ: -0.08, offsetY: 0 },
          { radius: 2.35, tube: 0.11, color: '#1e40af', angle: Math.PI * 0.55, rotZ: -0.05, offsetY: 0.08 },
          { radius: 2.8, tube: 0.10, color: '#2563eb', angle: Math.PI * 0.52, rotZ: -0.03, offsetY: 0.15 },
          { radius: 3.25, tube: 0.09, color: '#3b82f6', angle: Math.PI * 0.50, rotZ: -0.01, offsetY: 0.22 },
        ].map((arc, i) => (
          <ConstructionPiece key={i} delay={0.95 + i * 0.1} from={[3, 3, 0]} scaleAnim>
            <mesh rotation={[0, 0, arc.rotZ]} position={[0.05 * i, arc.offsetY, 0]}>
              <torusGeometry args={[arc.radius, arc.tube, 16, 48, arc.angle]} />
              <meshStandardMaterial color={arc.color} roughness={0.25} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Top arc connector - tighter wrap */}
      <ConstructionPiece delay={1.4} from={[2, 4, 0]} scaleAnim>
        <group position={[-1.1, 2.5, 0]}>
          <mesh rotation={[0, 0, -0.15]}>
            <torusGeometry args={[1.3, 0.12, 16, 32, Math.PI * 0.4]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.25} />
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
