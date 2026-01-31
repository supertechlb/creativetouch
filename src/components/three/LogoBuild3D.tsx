import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- ANIMATION CONFIG ---
const ANIM_DURATION = 2;
const RESTART_DELAY = 8;

// --- HELPER: ANIMATED BLOCK ---
const ConstructionPiece = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  distance = 5 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'; 
  distance?: number 
}) => {
  const group = useRef<THREE.Group>(null);
  const [startPos] = useState(() => {
    if (direction === 'up') return new THREE.Vector3(0, -distance, 0);
    if (direction === 'down') return new THREE.Vector3(0, distance, 0);
    if (direction === 'left') return new THREE.Vector3(distance, 0, 0);
    if (direction === 'right') return new THREE.Vector3(-distance, 0, 0);
    return new THREE.Vector3(0, 0, 0);
  });

  useFrame(({ clock }) => {
    if (!group.current) return;
    
    const t = clock.getElapsedTime() % RESTART_DELAY;
    let progress = Math.max(0, Math.min(1, (t - delay) / ANIM_DURATION));
    
    const ease = (x: number) => {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    };
    
    const eased = ease(progress);

    if (direction === 'scale') {
      group.current.scale.setScalar(eased);
    } else {
      group.current.position.x = THREE.MathUtils.lerp(startPos.x, 0, eased);
      group.current.position.y = THREE.MathUtils.lerp(startPos.y, 0, eased);
      group.current.position.z = THREE.MathUtils.lerp(startPos.z, 0, eased);
      
      group.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.Material).opacity = Math.max(0, Math.min(1, progress * 2));
          ((child as THREE.Mesh).material as THREE.Material).transparent = true;
        }
      });
    }
  });

  return <group ref={group}>{children}</group>;
};

// --- PART 1: THE FEATHER (Left) ---
const Feather = () => {
  const segments = useMemo(() => [
    { color: '#8e44ad', rot: [0, 0, 0.2], scale: 0.8 },
    { color: '#2980b9', rot: [0, 0, 0.1], scale: 1.0 },
    { color: '#1abc9c', rot: [0, 0, 0], scale: 1.1 },
    { color: '#f39c12', rot: [0, 0, -0.1], scale: 1.0 },
    { color: '#c0392b', rot: [0, 0, -0.2], scale: 0.7 },
  ], []);

  return (
    <group position={[-2.5, 0, 0]}>
      {segments.map((seg, i) => (
        <ConstructionPiece key={i} delay={0.5 + i * 0.15} direction="left" distance={3}>
          <group position={[0, 1.5 - i * 0.8, 0]} rotation={[seg.rot[0], seg.rot[1], seg.rot[2]]} scale={seg.scale}>
            <mesh castShadow position={[0, 0.3, 0]}>
              <coneGeometry args={[0.4, 0.8, 4]} />
              <meshPhysicalMaterial color={seg.color} roughness={0.2} metalness={0.1} clearcoat={1} />
            </mesh>
            <mesh castShadow position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.4, 0.8, 4]} />
              <meshPhysicalMaterial color={seg.color} roughness={0.2} metalness={0.1} clearcoat={1} />
            </mesh>
          </group>
        </ConstructionPiece>
      ))}
      <ConstructionPiece delay={1.3} direction="up" distance={4}>
        <mesh castShadow position={[0.1, -2.5, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.03, 0.05, 1.5, 8]} />
          <meshPhysicalMaterial color="#c0392b" roughness={0.3} metalness={0.2} />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- PART 2: THE TOWER (Center) ---
const Tower = () => {
  const slots = useMemo(() => [-1, 0, 1, 2, 3], []);

  return (
    <group position={[0, 0, 0]}>
      <ConstructionPiece delay={0} direction="up" distance={5}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 4, 4]} />
          <meshPhysicalMaterial color="#ff7a18" roughness={0.2} metalness={0.1} clearcoat={1} emissive="#ff5a00" emissiveIntensity={0.1} />
        </mesh>
      </ConstructionPiece>

      {slots.map((y, i) => (
        <ConstructionPiece key={i} delay={0.3 + i * 0.1} direction="right" distance={2}>
          <mesh castShadow position={[0, y * 0.6, 0.5]}>
            <boxGeometry args={[1.2, 0.15, 0.1]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>
        </ConstructionPiece>
      ))}
    </group>
  );
};

// --- PART 3: THE BLUE SAIL/CURVE (Right) ---
const BlueSail = () => {
  const curves = useMemo(() => [
    { radius: 3, tube: 0.3, pos: [1.2, -2, 0] as [number, number, number] },
    { radius: 3.5, tube: 0.25, pos: [1.2, -1.5, 0] as [number, number, number] },
    { radius: 4, tube: 0.2, pos: [1.2, -1.0, 0] as [number, number, number] },
    { radius: 4.5, tube: 0.15, pos: [1.2, -0.5, 0] as [number, number, number] },
  ], []);

  const pillars = useMemo(() => [-1, -0.3, 0.3, 1], []);

  return (
    <group position={[2.2, 0, 0]}>
      <ConstructionPiece delay={0.2} direction="down" distance={4}>
        <group>
          <mesh castShadow position={[0, -1.5, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.3]} />
            <meshPhysicalMaterial color="#2f61d5" roughness={0.2} metalness={0.1} clearcoat={1} />
          </mesh>
          {pillars.map((x, i) => (
            <mesh key={i} castShadow position={[x, -0.5, 0]}>
              <boxGeometry args={[0.15, 2, 0.15]} />
              <meshPhysicalMaterial color="#2f61d5" roughness={0.2} metalness={0.1} clearcoat={1} />
            </mesh>
          ))}
        </group>
      </ConstructionPiece>

      {curves.map((c, i) => (
        <ConstructionPiece key={i} delay={0.6 + i * 0.2} direction="scale" distance={1}>
          <group position={c.pos} rotation={[0, 0, -Math.PI / 2]}>
            <mesh castShadow>
              <torusGeometry args={[c.radius * 0.35, c.tube, 16, 32, Math.PI / 2]} />
              <meshPhysicalMaterial color="#2f61d5" roughness={0.2} metalness={0.1} clearcoat={1} />
            </mesh>
          </group>
        </ConstructionPiece>
      ))}
      
      <ConstructionPiece delay={1.5} direction="left" distance={3}>
        <mesh castShadow position={[1.2, 0.5, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.2, 0.3, 3.5, 16]} />
          <meshPhysicalMaterial color="#5b8def" roughness={0.2} metalness={0.1} clearcoat={1} />
        </mesh>
      </ConstructionPiece>
    </group>
  );
};

// --- MAIN SCENE ---
const LogoBuild3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[5, 8, 5]} intensity={1.2} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <directionalLight position={[-5, 4, -3]} intensity={0.4} />

        <Environment preset="city" />

        <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.2}>
          <group scale={0.85} position={[0, 0.3, 0]}>
            <Feather />
            <Tower />
            <BlueSail />
          </group>
        </Float>

        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={6} />
      </Canvas>
    </div>
  );
};

export default LogoBuild3D;
