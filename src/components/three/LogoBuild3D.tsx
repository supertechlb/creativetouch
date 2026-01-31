import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

// --- ANIMATION CONFIG ---
const ANIM_DURATION = 1.5;
const RESTART_DELAY = 8;

// --- MATERIALS ---
const materialProps = {
  roughness: 0.15,
  metalness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
};

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
    
    const ease = (x: number) => {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    };
    const val = ease(progress);

    group.current.position.lerpVectors(startVec, new THREE.Vector3(0, 0, 0), val);

    if (scaleAnim) {
      group.current.scale.setScalar(val);
    }
    
    group.current.children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        mat.transparent = true;
        mat.opacity = Math.max(0, Math.min(1, progress * 3));
      }
    });
  });

  return <group ref={group}>{children}</group>;
};

// --- PART 1: THE FEATHER (Left) ---
const Feather = () => {
  const segments = [
    { color: '#8e44ad', pos: [-0.2, 2.2, 0] as [number, number, number], rot: [0, 0, 0.4] as [number, number, number], scale: [0.8, 1, 0.2] as [number, number, number] },
    { color: '#2980b9', pos: [-0.4, 1.3, 0] as [number, number, number], rot: [0, 0, 0.25] as [number, number, number], scale: [0.9, 1.1, 0.2] as [number, number, number] },
    { color: '#1abc9c', pos: [-0.5, 0.3, 0] as [number, number, number], rot: [0, 0, 0.1] as [number, number, number], scale: [1.0, 1.2, 0.2] as [number, number, number] },
    { color: '#f39c12', pos: [-0.5, -0.8, 0] as [number, number, number], rot: [0, 0, -0.1] as [number, number, number], scale: [0.9, 1.1, 0.2] as [number, number, number] },
    { color: '#e74c3c', pos: [-0.3, -1.8, 0] as [number, number, number], rot: [0, 0, -0.3] as [number, number, number], scale: [0.8, 1, 0.2] as [number, number, number] },
  ];

  return (
    <group position={[-2.2, 0, 0]}>
      {segments.map((seg, i) => (
        <ConstructionPiece key={i} delay={i * 0.15} from={[-5, (2 - i) * 2, 0]} scaleAnim>
          <group position={seg.pos} rotation={seg.rot}>
            <mesh castShadow receiveShadow scale={seg.scale}>
              <cylinderGeometry args={[0, 1, 1.5, 4, 1]} />
              <meshPhysicalMaterial color={seg.color} {...materialProps} side={THREE.DoubleSide} />
            </mesh>
            <mesh castShadow receiveShadow scale={seg.scale} rotation={[Math.PI, 0, 0]} position={[0, -1.5, 0]}>
              <cylinderGeometry args={[0, 1, 1.5, 4, 1]} />
              <meshPhysicalMaterial color={seg.color} {...materialProps} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </ConstructionPiece>
      ))}
      <ConstructionPiece delay={1.2} from={[0, -5, 0]}>
        <mesh position={[-0.1, -3, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.08, 0.02, 2.5, 8]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- PART 2: THE BUILDING (Center) ---
const Building = () => {
  return (
    <group position={[0, -0.5, 0]}>
      <ConstructionPiece delay={0.5} from={[0, 10, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.4, 6, 4]} />
          <meshPhysicalMaterial color="#ff9f43" {...materialProps} flatShading={false} />
        </mesh>
      </ConstructionPiece>

      {[2, 1, 0, -1, -2].map((y, i) => (
        <ConstructionPiece key={i} delay={1.0 + i * 0.1} from={[0, 0, 5]} scaleAnim>
          <mesh position={[0, y * 0.9, 0.9]}>
            <boxGeometry args={[1.5 + i * 0.1, 0.25, 0.2]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </ConstructionPiece>
      ))}
    </group>
  );
};

// --- PART 3: THE BLUE WING (Right) ---
const BlueWing = () => {
  return (
    <group position={[1.8, 0, 0]}>
      <group position={[0.5, -3.2, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <ConstructionPiece key={i} delay={0.2 + i * 0.1} from={[5, -5, 0]}>
            <mesh position={[i * 0.6, i * 0.2, 0]} castShadow>
              <boxGeometry args={[0.4, 2 + i * 0.3, 0.4]} />
              <meshPhysicalMaterial color="#2980b9" {...materialProps} />
            </mesh>
          </ConstructionPiece>
        ))}
        <ConstructionPiece delay={0.8} from={[5, 0, 0]}>
          <mesh position={[1.2, -0.8, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[3.5, 0.5, 0.4]} />
            <meshPhysicalMaterial color="#2980b9" {...materialProps} />
          </mesh>
        </ConstructionPiece>
      </group>

      <group position={[-1, -2, 0]}>
        {[
          { r: 4.5, t: 0.25, c: '#3498db' },
          { r: 5.5, t: 0.20, c: '#54a0ff' },
          { r: 6.5, t: 0.15, c: '#74b9ff' }
        ].map((arc, i) => (
          <ConstructionPiece key={i} delay={1.5 + i * 0.2} from={[5, 5, 0]} scaleAnim>
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0.5]}>
              <torusGeometry args={[arc.r, arc.t, 16, 64, Math.PI / 2.5]} />
              <meshPhysicalMaterial color={arc.c} {...materialProps} />
            </mesh>
          </ConstructionPiece>
        ))}
      </group>
    </group>
  );
};

// --- MAIN SCENE ---
const LogoBuild3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 14], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight position={[-10, 0, 5]} intensity={0.5} color="white" />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <Center>
            <group scale={0.8}>
              <Feather />
              <Building />
              <BlueWing />
            </group>
          </Center>
        </Float>

        <ContactShadows
          position={[0, -4, 0]}
          opacity={0.5}
          scale={20}
          blur={2.5}
          far={5}
        />
      </Canvas>
    </div>
  );
};

export default LogoBuild3D;
