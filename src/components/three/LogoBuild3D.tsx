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

// --- FEATHER FACET (Flat polygon matching SVG exactly) ---
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
      {/* Flat rhombus/diamond shape using thin box rotated 45 degrees */}
      <mesh castShadow scale={scale} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1, 1, 0.12]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// --- PART 1: THE FEATHER (Left) - Diamond facets matching SVG S-curve ---
const Feather = () => {
  // Exact colors from SVG: #84508C (magenta), #299DB5/#2EA0A9 (cyan), 
  // #218694/#247C8E/#53928C (teal), #E88A35/#E19238 (orange), #E74326/#DD6C34/#DB5237 (red)
  const facets = [
    // Top tip - Magenta/Purple (from SVG #84508C)
    { color: '#84508C', pos: [0.35, 2.6, 0], rot: [0, 0, 0.55], scale: [0.28, 0.28, 1] },
    { color: '#9B5BA3', pos: [0.08, 2.25, 0], rot: [0, 0, 0.35], scale: [0.35, 0.35, 1] },
    
    // Upper section - Cyan (from SVG #299DB5, #2EA0A9)
    { color: '#299DB5', pos: [-0.18, 1.9, 0], rot: [0, 0, 0.2], scale: [0.42, 0.42, 1] },
    { color: '#2EA0A9', pos: [0.1, 1.55, 0], rot: [0, 0, 0.08], scale: [0.45, 0.45, 1] },
    { color: '#299DB5', pos: [-0.28, 1.25, 0], rot: [0, 0, 0.18], scale: [0.40, 0.40, 1] },
    
    // Middle section - Teal (from SVG #218694, #247C8E, #53928C)
    { color: '#218694', pos: [-0.35, 0.9, 0], rot: [0, 0, 0.05], scale: [0.50, 0.50, 1] },
    { color: '#247C8E', pos: [0.0, 0.55, 0], rot: [0, 0, -0.02], scale: [0.52, 0.52, 1] },
    { color: '#53928C', pos: [-0.38, 0.2, 0], rot: [0, 0, 0.0], scale: [0.48, 0.48, 1] },
    { color: '#218694', pos: [-0.05, -0.15, 0], rot: [0, 0, -0.05], scale: [0.50, 0.50, 1] },
    
    // Lower section - Orange (from SVG #E88A35, #E19238)
    { color: '#E88A35', pos: [-0.3, -0.5, 0], rot: [0, 0, -0.1], scale: [0.48, 0.48, 1] },
    { color: '#E19238', pos: [0.02, -0.85, 0], rot: [0, 0, -0.18], scale: [0.45, 0.45, 1] },
    { color: '#E88A35', pos: [-0.22, -1.15, 0], rot: [0, 0, -0.12], scale: [0.42, 0.42, 1] },
    
    // Bottom section - Red (from SVG #E74326, #DD6C34, #DB5237)
    { color: '#E74326', pos: [0.08, -1.45, 0], rot: [0, 0, -0.25], scale: [0.40, 0.40, 1] },
    { color: '#DD6C34', pos: [-0.1, -1.75, 0], rot: [0, 0, -0.32], scale: [0.35, 0.35, 1] },
    { color: '#DB5237', pos: [0.18, -2.0, 0], rot: [0, 0, -0.42], scale: [0.30, 0.30, 1] },
    
    // Tip - Dark red (from SVG #E16833)
    { color: '#E16833', pos: [0.42, -2.25, 0], rot: [0, 0, -0.55], scale: [0.22, 0.22, 1] },
  ];

  return (
    <group position={[-2.2, 0.2, 0]}>
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
        <mesh position={[0.6, -2.65, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.025, 0.01, 1.0, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- PART 2: THE ORANGE BUILDING (Center) - Smooth tapered tower matching SVG ---
const OrangeBuilding = () => {
  // Colors from SVG: #E16833, #E88A35, #E19238 - orange gradient
  const segments = [
    { y: -2.1, w: 1.4, h: 0.95, color: '#C65A2C' },   // Dark orange base
    { y: -1.2, w: 1.32, h: 0.85, color: '#E16833' },  // From SVG
    { y: -0.4, w: 1.22, h: 0.75, color: '#E88A35' },  // From SVG
    { y: 0.3, w: 1.12, h: 0.65, color: '#E19238' },   // From SVG
    { y: 0.9, w: 1.0, h: 0.55, color: '#F0A040' },    // Light orange
    { y: 1.4, w: 0.85, h: 0.45, color: '#F5B050' },   // Yellow-orange
    { y: 1.8, w: 0.68, h: 0.35, color: '#FAC060' },   // Light yellow
  ];

  return (
    <group position={[0.1, 0, 0]}>
      {/* Main building body - smooth tapered segments */}
      <ConstructionPiece delay={0.3} from={[0, 8, 0]}>
        {segments.map((seg, i) => (
          <mesh key={i} castShadow position={[0, seg.y, 0]}>
            <boxGeometry args={[seg.w, seg.h, 0.4]} />
            <meshStandardMaterial color={seg.color} roughness={0.25} />
          </mesh>
        ))}
        {/* Stepped crown top - matching SVG notch */}
        <mesh castShadow position={[0, 2.15, 0]}>
          <boxGeometry args={[0.48, 0.3, 0.32]} />
          <meshStandardMaterial color="#FFD070" roughness={0.25} />
        </mesh>
        <mesh castShadow position={[0, 2.4, 0]}>
          <boxGeometry args={[0.25, 0.2, 0.22]} />
          <meshStandardMaterial color="#FFE090" roughness={0.25} />
        </mesh>
      </ConstructionPiece>

      {/* White horizontal slots - evenly spaced stripes */}
      {[
        { y: -2.45, w: 1.42 },
        { y: -1.6, w: 1.35 },
        { y: -0.8, w: 1.26 },
        { y: -0.05, w: 1.16 },
        { y: 0.6, w: 1.05 },
        { y: 1.15, w: 0.92 },
        { y: 1.6, w: 0.75 },
        { y: 1.98, w: 0.55 },
      ].map((slot, i) => (
        <ConstructionPiece key={i} delay={0.55 + i * 0.05} from={[0, 0, 3]} scaleAnim>
          <mesh position={[0, slot.y, 0.22]}>
            <boxGeometry args={[slot.w, 0.08, 0.04]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </ConstructionPiece>
      ))}
    </group>
  );
};

// --- PART 3: THE BLUE CURVED STRUCTURE (Right) - Connected arc system matching SVG ---
const BlueTower = () => {
  // Colors from SVG: #3B53A4, #4259A6, #435CA9, #3B53A1 (dark blue)
  // #4A69B0, #455CA2, #5780BD, #557CBB (medium blue)
  // #5F8DC7, #66A5D9 (light blue)
  
  return (
    <group position={[0.4, 0, 0]}>
      {/* Base structure with pillars */}
      <group position={[0.8, -2.35, 0]}>
        {/* Curved base connecting pillars - matching SVG curve */}
        <ConstructionPiece delay={0.12} from={[4, -3, 0]}>
          <mesh position={[0.35, -0.5, 0]} rotation={[0, 0, -0.1]}>
            <torusGeometry args={[1.05, 0.1, 8, 32, Math.PI * 0.45]} />
            <meshStandardMaterial color="#3B53A4" roughness={0.2} />
          </mesh>
        </ConstructionPiece>
        
        {/* Vertical pillars - matching SVG proportions */}
        {[
          { x: -0.45, h: 1.4, color: '#4259A6' },
          { x: -0.02, h: 1.85, color: '#435CA9' },
          { x: 0.38, h: 2.3, color: '#4A69B0' },
          { x: 0.78, h: 2.75, color: '#5780BD' },
          { x: 1.18, h: 3.25, color: '#5F8DC7' },
        ].map((pillar, i) => (
          <ConstructionPiece key={i} delay={0.18 + i * 0.07} from={[3, -4, 0]}>
            <mesh position={[pillar.x, pillar.h / 2 - 0.35, 0]} castShadow>
              <boxGeometry args={[0.1, pillar.h, 0.1]} />
              <meshStandardMaterial color={pillar.color} roughness={0.2} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Curved arcs wrapping around building - matching SVG WiFi signal shape */}
      <group position={[-0.85, -0.2, -0.05]}>
        {[
          { radius: 1.85, tube: 0.11, color: '#3B53A1', angle: Math.PI * 0.55, rotZ: -0.05, offsetX: 0, offsetY: 0 },
          { radius: 2.3, tube: 0.10, color: '#455CA2', angle: Math.PI * 0.52, rotZ: -0.03, offsetX: 0.03, offsetY: 0.05 },
          { radius: 2.75, tube: 0.09, color: '#557CBB', angle: Math.PI * 0.50, rotZ: -0.02, offsetX: 0.06, offsetY: 0.1 },
          { radius: 3.2, tube: 0.08, color: '#66A5D9', angle: Math.PI * 0.48, rotZ: -0.01, offsetX: 0.09, offsetY: 0.15 },
        ].map((arc, i) => (
          <ConstructionPiece key={i} delay={0.95 + i * 0.1} from={[3, 3, 0]} scaleAnim>
            <mesh rotation={[0, 0, arc.rotZ]} position={[arc.offsetX, arc.offsetY, 0]}>
              <torusGeometry args={[arc.radius, arc.tube, 16, 48, arc.angle]} />
              <meshStandardMaterial color={arc.color} roughness={0.2} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Top arc connector - tighter wrap matching SVG */}
      <ConstructionPiece delay={1.4} from={[2, 4, 0]} scaleAnim>
        <group position={[-1.0, 2.4, 0]}>
          <mesh rotation={[0, 0, -0.12]}>
            <torusGeometry args={[1.25, 0.1, 16, 32, Math.PI * 0.38]} />
            <meshStandardMaterial color="#3B53A4" roughness={0.2} />
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
