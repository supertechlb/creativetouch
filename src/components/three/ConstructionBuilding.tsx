import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Materials factory
const useMaterials = () => {
  return useMemo(() => ({
    concrete: new THREE.MeshStandardMaterial({
      color: '#e9eaec',
      roughness: 0.85,
      metalness: 0.05,
    }),
    darkCore: new THREE.MeshStandardMaterial({
      color: '#2b2f36',
      roughness: 0.6,
      metalness: 0.2,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#cfe9ff',
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.85,
      thickness: 0.25,
      ior: 1.35,
      clearcoat: 0.7,
      transparent: true,
      opacity: 0.95,
    }),
    orange: new THREE.MeshStandardMaterial({
      color: '#ff7a18',
      roughness: 0.35,
      metalness: 0.25,
      emissive: new THREE.Color('#ff5a00'),
      emissiveIntensity: 0.12,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: '#b9c0c8',
      roughness: 0.35,
      metalness: 0.75,
    }),
  }), []);
};

// Building Core with animated floors and glass
const BuildingCore = ({ 
  floors, 
  floorHeight, 
  mats, 
  parentRef 
}: { 
  floors: number; 
  floorHeight: number; 
  mats: ReturnType<typeof useMaterials>; 
  parentRef: React.RefObject<THREE.Group>;
}) => {
  const floorsRef = useRef<(THREE.Mesh | null)[]>([]);
  const glassRef = useRef<(THREE.Mesh | null)[]>([]);
  const roofRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const progress = parentRef.current?.userData?.progress ?? 0;

    // Foundation phase
    const foundationP = THREE.MathUtils.smoothstep(progress, 0.02, 0.15);

    // Floors assembly phase
    const floorsP = THREE.MathUtils.smoothstep(progress, 0.15, 0.55);

    // Glass facade phase
    const glassP = THREE.MathUtils.smoothstep(progress, 0.55, 0.85);

    // Roof phase
    const roofP = THREE.MathUtils.smoothstep(progress, 0.85, 0.95);

    // Animate floors: each floor rises into place sequentially
    floorsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const targetY = i * floorHeight + 0.1;
      const appearAt = i / floors;
      const local = THREE.MathUtils.clamp((floorsP - appearAt) * 2.2, 0, 1);
      const eased = local * local * (3 - 2 * local);

      mesh.scale.y = 0.9 + 0.1 * foundationP;
      mesh.position.y = THREE.MathUtils.lerp(-0.8, targetY, eased);
      mesh.visible = local > 0.01;
    });

    // Glass panels fade/slide in
    glassRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const appearAt = i / glassRef.current.length;
      const local = THREE.MathUtils.clamp((glassP - appearAt) * 2.0, 0, 1);
      const eased = local * local * (3 - 2 * local);

      (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.05 + 0.9 * eased;
      mesh.position.z = THREE.MathUtils.lerp(0.65, 0.5, eased);
      mesh.visible = eased > 0.02;
    });

    // Roof animation
    if (roofRef.current) {
      roofRef.current.visible = roofP > 0.02;
      roofRef.current.scale.setScalar(THREE.MathUtils.lerp(0.6, 1.0, roofP));
    }
  });

  return (
    <group>
      {/* Dark core column */}
      <mesh castShadow material={mats.darkCore} position={[0, 0.6, 0]}>
        <boxGeometry args={[0.45, floors * floorHeight + 0.45, 0.35]} />
      </mesh>

      {/* Floors */}
      <group>
        {Array.from({ length: floors }).map((_, i) => (
          <mesh
            key={`floor-${i}`}
            ref={(el) => { floorsRef.current[i] = el; }}
            castShadow
            material={mats.concrete}
            position={[0, -0.8, 0]}
            visible={false}
          >
            <boxGeometry args={[1.6, 0.18, 1.05]} />
          </mesh>
        ))}
      </group>

      {/* Glass facade panels */}
      <group>
        {Array.from({ length: floors * 2 }).map((_, i) => (
          <mesh
            key={`glass-${i}`}
            ref={(el) => { glassRef.current[i] = el; }}
            castShadow
            material={mats.glass.clone()}
            position={[0, 0.2 + (i % floors) * floorHeight, 0.65]}
            visible={false}
          >
            <boxGeometry args={[1.58, 0.12, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* Roof */}
      <mesh
        ref={roofRef}
        castShadow
        material={mats.steel}
        position={[0, floors * floorHeight + 0.2, 0]}
        visible={false}
      >
        <boxGeometry args={[1.75, 0.12, 1.15]} />
      </mesh>
    </group>
  );
};

// Crane with animated hook
const Crane = ({ 
  mats, 
  craneRef, 
  parentRef 
}: { 
  mats: ReturnType<typeof useMaterials>; 
  craneRef: React.RefObject<THREE.Group>;
  parentRef: React.RefObject<THREE.Group>;
}) => {
  useFrame(() => {
    const progress = parentRef.current?.userData?.progress ?? 0;
    const show = progress > 0.08;
    if (craneRef.current) craneRef.current.visible = show;
  });

  return (
    <group ref={craneRef} position={[1.4, 0.0, -0.6]} visible={false}>
      {/* Base */}
      <mesh castShadow material={mats.steel} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.4, 16]} />
      </mesh>
      {/* Tower */}
      <mesh castShadow material={mats.orange} position={[0, 1.2, 0]}>
        <boxGeometry args={[0.12, 2.0, 0.12]} />
      </mesh>
      {/* Boom */}
      <mesh castShadow material={mats.orange} position={[0.8, 2.15, 0]}>
        <boxGeometry args={[1.7, 0.08, 0.08]} />
      </mesh>
      {/* Counter boom */}
      <mesh castShadow material={mats.steel} position={[-0.35, 2.15, 0]}>
        <boxGeometry args={[0.7, 0.06, 0.06]} />
      </mesh>
      {/* Cable */}
      <mesh material={mats.steel} position={[1.55, 1.55, 0]}>
        <boxGeometry args={[0.01, 1.2, 0.01]} />
      </mesh>
      {/* Hook */}
      <mesh castShadow material={mats.orange} position={[1.55, 0.95, 0]}>
        <torusGeometry args={[0.06, 0.02, 10, 24]} />
      </mesh>
    </group>
  );
};

// Perimeter safety rails
const PerimeterRails = ({ mats }: { mats: ReturnType<typeof useMaterials> }) => {
  const railY = 0.22;
  return (
    <group position={[0, railY, 0]}>
      <mesh castShadow material={mats.orange} position={[0, 0.08, 0.62]}>
        <boxGeometry args={[2.0, 0.03, 0.03]} />
      </mesh>
      <mesh castShadow material={mats.orange} position={[0, 0.08, -0.62]}>
        <boxGeometry args={[2.0, 0.03, 0.03]} />
      </mesh>
      <mesh castShadow material={mats.orange} position={[1.0, 0.08, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.25]} />
      </mesh>
      <mesh castShadow material={mats.orange} position={[-1.0, 0.08, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.25]} />
      </mesh>
    </group>
  );
};

// Main scene building
const SceneBuilding = () => {
  const group = useRef<THREE.Group>(null);
  const crane = useRef<THREE.Group>(null);
  const tRef = useRef(0);

  const floors = 7;
  const floorHeight = 0.32;

  const materials = useMaterials();

  useFrame((state, delta) => {
    // Slow orbit / presentation
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.2) * 0.22,
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -0.08,
        0.06
      );
    }

    // Construction timeline loop (10 seconds)
    const duration = 10.0;
    tRef.current += delta;
    const loopT = (tRef.current % duration) / duration;

    // Crane hook animation
    if (crane.current) {
      const swing = Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
      crane.current.rotation.z = swing;
      crane.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.05;
    }

    // Store progress on group for children to read
    if (group.current) group.current.userData.progress = loopT;
  });

  return (
    <group ref={group} position={[0, 0.0, 0]} scale={1.05}>
      {/* Ground plinth */}
      <mesh receiveShadow position={[0, -0.12, 0]} material={materials.concrete}>
        <boxGeometry args={[3.2, 0.18, 2.2]} />
      </mesh>

      {/* Building core */}
      <BuildingCore 
        floors={floors} 
        floorHeight={floorHeight} 
        mats={materials} 
        parentRef={group} 
      />

      {/* Crane */}
      <Crane mats={materials} craneRef={crane} parentRef={group} />

      {/* Orange safety rails */}
      <PerimeterRails mats={materials} />
    </group>
  );
};

// Main exported component
const ConstructionBuilding = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [3.2, 2.2, 5.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          castShadow
          position={[6, 8, 4]}
          intensity={1.15}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.35} />
        
        <Environment preset="city" />

        <Float speed={0.65} rotationIntensity={0.25} floatIntensity={0.25}>
          <SceneBuilding />
        </Float>

        <ContactShadows
          position={[0, -0.12, 0]}
          opacity={0.5}
          scale={8}
          blur={2.2}
          far={6}
        />
      </Canvas>
    </div>
  );
};

export default ConstructionBuilding;
