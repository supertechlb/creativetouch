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

// --- FEATHER FACET (Diamond polygon matching logo) ---
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
      {/* Diamond shape - two triangles pointing up and down */}
      <mesh castShadow scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.0}
          flatShading={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// --- PART 1: THE FEATHER (Left) - Geometric low-poly style ---
const Feather = () => {
  // Diamond facets arranged in S-curve matching the logo exactly
  const facets = [
    // Top tip - Magenta/Pink (small, tilted right)
    { color: '#e040fb', pos: [0.5, 2.6, 0], rot: [0, 0, 0.7], scale: [0.35, 0.55, 0.12] },
    { color: '#d500f9', pos: [0.25, 2.2, 0], rot: [0, 0, 0.5], scale: [0.45, 0.65, 0.12] },
    
    // Upper section - Cyan/Turquoise
    { color: '#00bcd4', pos: [-0.05, 1.85, 0], rot: [0, 0, 0.35], scale: [0.55, 0.75, 0.12] },
    { color: '#26c6da', pos: [0.2, 1.5, 0], rot: [0, 0, 0.25], scale: [0.5, 0.7, 0.12] },
    { color: '#00acc1', pos: [-0.2, 1.45, 0], rot: [0, 0, 0.4], scale: [0.45, 0.6, 0.12] },
    
    // Middle section - Teal (widest part)
    { color: '#009688', pos: [-0.35, 1.05, 0], rot: [0, 0, 0.2], scale: [0.6, 0.8, 0.12] },
    { color: '#4db6ac', pos: [0.0, 0.85, 0], rot: [0, 0, 0.1], scale: [0.55, 0.75, 0.12] },
    { color: '#26a69a', pos: [-0.4, 0.55, 0], rot: [0, 0, 0.15], scale: [0.5, 0.65, 0.12] },
    { color: '#80cbc4', pos: [-0.15, 0.35, 0], rot: [0, 0, 0.05], scale: [0.55, 0.7, 0.12] },
    
    // Lower section - Orange/Yellow
    { color: '#ffb300', pos: [-0.3, 0.0, 0], rot: [0, 0, -0.05], scale: [0.6, 0.75, 0.12] },
    { color: '#ff9800', pos: [0.0, -0.25, 0], rot: [0, 0, -0.12], scale: [0.55, 0.7, 0.12] },
    { color: '#ffa726', pos: [-0.25, -0.55, 0], rot: [0, 0, -0.08], scale: [0.5, 0.65, 0.12] },
    
    // Bottom section - Red
    { color: '#f44336', pos: [0.05, -0.85, 0], rot: [0, 0, -0.2], scale: [0.55, 0.7, 0.12] },
    { color: '#ef5350', pos: [-0.15, -1.15, 0], rot: [0, 0, -0.25], scale: [0.48, 0.6, 0.12] },
    { color: '#e53935', pos: [0.15, -1.45, 0], rot: [0, 0, -0.35], scale: [0.42, 0.55, 0.12] },
    
    // Tip - Dark red
    { color: '#c62828', pos: [0.35, -1.8, 0], rot: [0, 0, -0.5], scale: [0.32, 0.45, 0.12] },
  ];

  return (
    <group position={[-2.3, 0.0, 0]}>
      {facets.map((facet, i) => (
        <ConstructionPiece 
          key={i} 
          delay={0.05 + i * 0.05} 
          from={[-2 - Math.random() * 2, 3 - i * 0.2, Math.random() - 0.5]} 
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
      <ConstructionPiece delay={0.9} from={[0, -5, 0]}>
        <mesh position={[0.5, -2.3, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.035, 0.015, 1.0, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- PART 2: THE ORANGE BUILDING (Center) - Tapered rectangular tower ---
const OrangeBuilding = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Main building body - tapered rectangle with gradient effect */}
      <ConstructionPiece delay={0.3} from={[0, 8, 0]}>
        {/* Bottom section - darker orange */}
        <mesh castShadow position={[0, -1.8, 0]}>
          <boxGeometry args={[1.3, 1.8, 0.5]} />
          <meshStandardMaterial color="#f57c00" roughness={0.3} />
        </mesh>
        {/* Middle-lower section */}
        <mesh castShadow position={[0, -0.4, 0]}>
          <boxGeometry args={[1.2, 1.0, 0.5]} />
          <meshStandardMaterial color="#fb8c00" roughness={0.3} />
        </mesh>
        {/* Middle section */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.1, 0.9, 0.5]} />
          <meshStandardMaterial color="#ffa726" roughness={0.3} />
        </mesh>
        {/* Upper section */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <boxGeometry args={[1.0, 0.8, 0.5]} />
          <meshStandardMaterial color="#ffb74d" roughness={0.3} />
        </mesh>
        {/* Top section - yellow */}
        <mesh castShadow position={[0, 2.0, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.5]} />
          <meshStandardMaterial color="#ffc107" roughness={0.3} />
        </mesh>
        {/* Yellow cap with notch */}
        <mesh castShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[0.7, 0.4, 0.4]} />
          <meshStandardMaterial color="#ffd54f" roughness={0.3} />
        </mesh>
        {/* Small top piece */}
        <mesh castShadow position={[0, 2.85, 0]}>
          <boxGeometry args={[0.35, 0.3, 0.3]} />
          <meshStandardMaterial color="#ffecb3" roughness={0.3} />
        </mesh>
      </ConstructionPiece>

      {/* White horizontal slots - matching logo exactly */}
      {[
        { y: -2.4, w: 1.35 },
        { y: -1.7, w: 1.3 },
        { y: -1.0, w: 1.25 },
        { y: -0.3, w: 1.2 },
        { y: 0.4, w: 1.1 },
        { y: 1.1, w: 1.0 },
        { y: 1.75, w: 0.9 },
        { y: 2.3, w: 0.75 },
      ].map((slot, i) => (
        <ConstructionPiece key={i} delay={0.6 + i * 0.06} from={[0, 0, 3]} scaleAnim>
          <mesh position={[0, slot.y, 0.26]}>
            <boxGeometry args={[slot.w, 0.12, 0.06]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </ConstructionPiece>
      ))}
    </group>
  );
};

// --- PART 3: THE BLUE CURVED STRUCTURE (Right) - Matching logo arcs ---
const BlueTower = () => {
  return (
    <group position={[0.4, 0, 0]}>
      {/* Vertical pillars at base - forming colonnade */}
      <group position={[1.2, -2.2, 0]}>
        {/* Bottom curved base connecting pillars */}
        <ConstructionPiece delay={0.15} from={[4, -3, 0]}>
          <mesh position={[0.3, -0.5, 0]}>
            <boxGeometry args={[2.0, 0.25, 0.2]} />
            <meshStandardMaterial color="#1e40af" roughness={0.25} />
          </mesh>
        </ConstructionPiece>
        
        {/* Vertical pillars - evenly spaced, heights matching logo */}
        {[
          { x: -0.55, h: 1.6 },
          { x: -0.1, h: 2.0 },
          { x: 0.35, h: 2.4 },
          { x: 0.8, h: 2.8 },
          { x: 1.25, h: 3.2 },
        ].map((pillar, i) => (
          <ConstructionPiece key={i} delay={0.2 + i * 0.08} from={[3, -4, 0]}>
            <mesh position={[pillar.x, pillar.h / 2 - 0.35, 0]} castShadow>
              <boxGeometry args={[0.15, pillar.h, 0.15]} />
              <meshStandardMaterial color="#2563eb" roughness={0.25} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Curved arcs wrapping around building - WiFi signal style */}
      <group position={[-0.8, -0.5, 0]}>
        {[
          { radius: 1.8, tube: 0.14, color: '#1e3a8a', angle: Math.PI * 0.55, rotZ: -0.1 },
          { radius: 2.3, tube: 0.12, color: '#1e40af', angle: Math.PI * 0.52, rotZ: -0.08 },
          { radius: 2.8, tube: 0.11, color: '#2563eb', angle: Math.PI * 0.50, rotZ: -0.05 },
          { radius: 3.3, tube: 0.10, color: '#3b82f6', angle: Math.PI * 0.48, rotZ: -0.02 },
        ].map((arc, i) => (
          <ConstructionPiece key={i} delay={1.0 + i * 0.1} from={[3, 3, 0]} scaleAnim>
            <mesh rotation={[0, 0, arc.rotZ]} position={[0.1 * i, 0.1 * i, 0]}>
              <torusGeometry args={[arc.radius, arc.tube, 16, 48, arc.angle]} />
              <meshStandardMaterial color={arc.color} roughness={0.25} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Top curved connector piece */}
      <ConstructionPiece delay={1.5} from={[2, 4, 0]} scaleAnim>
        <group position={[-1.0, 2.4, 0]}>
          <mesh rotation={[0, 0, -0.2]}>
            <torusGeometry args={[1.4, 0.15, 16, 32, Math.PI * 0.42]} />
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
