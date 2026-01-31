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

// --- FEATHER SEGMENT (Diamond shape) ---
const FeatherSegment = ({ 
  color, 
  position, 
  rotation, 
  scale 
}: { 
  color: string; 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  scale: [number, number, number];
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Top cone */}
      <mesh castShadow scale={scale}>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1} 
          clearcoat={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bottom cone (inverted) */}
      <mesh castShadow scale={scale} rotation={[Math.PI, 0, 0]} position={[0, -1.2, 0]}>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1} 
          clearcoat={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// --- PART 1: THE FEATHER (Left) ---
const Feather = () => {
  // Accurate colors from logo: magenta -> cyan -> teal -> orange -> red
  const segments = [
    { color: '#c850c0', pos: [0.15, 2.8, 0], rot: [0, 0, 0.35], scale: [0.5, 0.6, 0.15] }, // Magenta tip
    { color: '#36d1dc', pos: [-0.1, 2.0, 0], rot: [0, 0, 0.2], scale: [0.6, 0.7, 0.15] },  // Cyan
    { color: '#20b2aa', pos: [-0.25, 1.2, 0], rot: [0, 0, 0.1], scale: [0.7, 0.8, 0.15] }, // Teal
    { color: '#48c9b0', pos: [-0.3, 0.4, 0], rot: [0, 0, 0], scale: [0.75, 0.85, 0.15] },  // Light teal
    { color: '#f39c12', pos: [-0.25, -0.5, 0], rot: [0, 0, -0.1], scale: [0.7, 0.8, 0.15] }, // Orange
    { color: '#e74c3c', pos: [-0.1, -1.3, 0], rot: [0, 0, -0.2], scale: [0.6, 0.7, 0.15] }, // Red
    { color: '#c0392b', pos: [0.1, -2.0, 0], rot: [0, 0, -0.3], scale: [0.45, 0.55, 0.15] }, // Dark red
  ];

  return (
    <group position={[-2.8, 0.3, 0]}>
      {segments.map((seg, i) => (
        <ConstructionPiece 
          key={i} 
          delay={0.1 + i * 0.12} 
          from={[-4, (3 - i) * 1.5, 0]} 
          scaleAnim
        >
          <FeatherSegment
            color={seg.color}
            position={seg.pos as [number, number, number]}
            rotation={seg.rot as [number, number, number]}
            scale={seg.scale as [number, number, number]}
          />
        </ConstructionPiece>
      ))}
      {/* Quill stem */}
      <ConstructionPiece delay={1.0} from={[0, -6, 0]}>
        <mesh position={[0.2, -2.8, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.04, 0.02, 1.8, 8]} />
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
    <group position={[1.6, 0, 0]}>
      {/* Base with vertical pillars */}
      <group position={[0.8, -2.2, 0]}>
        {/* Bottom horizontal bar */}
        <ConstructionPiece delay={0.2} from={[4, -3, 0]}>
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[2.8, 0.35, 0.3]} />
            <meshPhysicalMaterial color="#2563eb" roughness={0.2} clearcoat={0.8} />
          </mesh>
        </ConstructionPiece>
        
        {/* Vertical pillars - arranged in a slight curve */}
        {[
          { x: -1.1, h: 2.2 },
          { x: -0.5, h: 2.6 },
          { x: 0.1, h: 3.0 },
          { x: 0.7, h: 3.4 },
          { x: 1.3, h: 3.8 },
        ].map((pillar, i) => (
          <ConstructionPiece key={i} delay={0.3 + i * 0.1} from={[3, -4, 0]}>
            <mesh position={[pillar.x, pillar.h / 2 - 0.6, 0]} castShadow>
              <boxGeometry args={[0.22, pillar.h, 0.22]} />
              <meshPhysicalMaterial color="#2563eb" roughness={0.2} clearcoat={0.8} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Curved arcs (the wifi-signal-like swoops) */}
      <group position={[-0.8, -1.5, 0]}>
        {[
          { radius: 2.8, tube: 0.18, color: '#1d4ed8' },
          { radius: 3.4, tube: 0.16, color: '#2563eb' },
          { radius: 4.0, tube: 0.14, color: '#3b82f6' },
          { radius: 4.6, tube: 0.12, color: '#60a5fa' },
        ].map((arc, i) => (
          <ConstructionPiece key={i} delay={1.2 + i * 0.15} from={[4, 4, 0]} scaleAnim>
            <mesh rotation={[0, 0, -0.3]}>
              <torusGeometry args={[arc.radius, arc.tube, 16, 48, Math.PI * 0.45]} />
              <meshPhysicalMaterial 
                color={arc.color} 
                roughness={0.2} 
                clearcoat={0.8}
              />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>

      {/* Top curved piece that goes around the building */}
      <ConstructionPiece delay={1.8} from={[3, 3, 0]} scaleAnim>
        <group position={[-1.5, 1.8, 0]}>
          <mesh rotation={[0, 0, -0.5]}>
            <torusGeometry args={[2.2, 0.2, 16, 32, Math.PI * 0.35]} />
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
