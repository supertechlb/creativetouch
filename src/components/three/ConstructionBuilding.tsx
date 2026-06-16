import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, Edges } from '@react-three/drei';
import * as THREE from 'three';

// Materials factory
const useMaterials = () => {
  return useMemo(() => ({
    concrete: new THREE.MeshStandardMaterial({
      color: '#e5e7eb', // lighter, clean concrete
      roughness: 0.7,
      metalness: 0.1,
    }),
    darkCore: new THREE.MeshStandardMaterial({
      color: '#1e293b', // deep slate core
      roughness: 0.5,
      metalness: 0.3,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#93c5fd', // vibrant blue glass
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      thickness: 0.2,
      ior: 1.5,
      transparent: true,
      opacity: 0.7,
    }),
    orange: new THREE.MeshStandardMaterial({
      color: '#f97316', // neon construction orange
      roughness: 0.4,
      metalness: 0.3,
      emissive: new THREE.Color('#ea580c'),
      emissiveIntensity: 0.15,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: '#64748b', // steely blue gray
      roughness: 0.2,
      metalness: 0.9,
    }),
  }), []);
};

// Sparks emitter to represent construction welding
const WeldingSparks = ({ activeY }: { activeY: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 40;

  // Initialize particle positions, velocities, and lifetimes
  const [positions, velocities, ages] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const agesArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 1] = activeY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      vels[i * 3] = (Math.random() - 0.5) * 0.5;
      vels[i * 3 + 1] = -0.6 - Math.random() * 0.6; // fall down
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      agesArr[i] = Math.random() * 1.5;
    }
    return [pos, vels, agesArr];
  }, [activeY]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const geo = points.geometry;
    const posAttr = geo.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      ages[i] += delta;

      if (ages[i] > 1.2) {
        // Reset to active sparks height
        posArray[i * 3] = (Math.random() - 0.5) * 1.2;
        posArray[i * 3 + 1] = activeY + (Math.random() - 0.5) * 0.05;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
        ages[i] = 0;
      } else {
        // Fall down
        posArray[i * 3] += velocities[i * 3] * delta;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f97316"
        size={0.055}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Detailed Steel Truss Frame between floors
const FloorStructuralFrames = ({ 
  y, 
  mats 
}: { 
  y: number; 
  mats: ReturnType<typeof useMaterials> 
}) => {
  return (
    <group position={[0, y, 0]}>
      {/* 4 Corner columns */}
      <mesh castShadow material={mats.steel} position={[-0.78, 0.16, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
      </mesh>
      <mesh castShadow material={mats.steel} position={[0.78, 0.16, 0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
      </mesh>
      <mesh castShadow material={mats.steel} position={[-0.78, 0.16, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
      </mesh>
      <mesh castShadow material={mats.steel} position={[0.78, 0.16, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
      </mesh>

      {/* Cross truss beams for diagonal support */}
      <group rotation={[0, 0, 0.39]} position={[0, 0.16, 0.5]}>
        <mesh material={mats.steel}>
          <boxGeometry args={[1.7, 0.012, 0.012]} />
        </mesh>
      </group>
      <group rotation={[0, 0, -0.39]} position={[0, 0.16, -0.5]}>
        <mesh material={mats.steel}>
          <boxGeometry args={[1.7, 0.012, 0.012]} />
        </mesh>
      </group>
    </group>
  );
};

// Building Core with animated floors, glass facade, steel trusses and blueprints lines
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
  const floorsRef = useRef<(THREE.Group | null)[]>([]);
  const glassRef = useRef<(THREE.Mesh | null)[]>([]);
  const scaffoldRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const progress = parentRef.current?.userData?.progress ?? 0;

    // Phases
    const foundationP = THREE.MathUtils.smoothstep(progress, 0.02, 0.15);
    const floorsP = THREE.MathUtils.smoothstep(progress, 0.15, 0.60);
    const glassP = THREE.MathUtils.smoothstep(progress, 0.60, 0.85);
    const roofP = THREE.MathUtils.smoothstep(progress, 0.85, 0.98);

    // Dynamic height indicator representing active work
    let activeY = -0.8;

    // Animate floors: each floor rises into place sequentially
    floorsRef.current.forEach((group, i) => {
      if (!group) return;
      const targetY = i * floorHeight + 0.1;
      const appearAt = i / floors;
      const local = THREE.MathUtils.clamp((floorsP - appearAt) * 2.5, 0, 1);
      const eased = local * local * (3 - 2 * local);

      group.scale.y = 0.9 + 0.1 * foundationP;
      group.position.y = THREE.MathUtils.lerp(-0.8, targetY, eased);
      group.visible = local > 0.01;

      if (local > 0.05 && local < 0.99) {
        activeY = group.position.y + 0.2;
      }
    });

    // Animate scaffolding position to hover around active floor construction
    if (scaffoldRef.current) {
      const activeConstructFloor = floorsRef.current.find(g => g && g.visible && g.position.y < (floors - 1) * floorHeight);
      if (activeConstructFloor && progress > 0.15 && progress < 0.85) {
        scaffoldRef.current.visible = true;
        scaffoldRef.current.position.y = activeConstructFloor.position.y + 0.2;
      } else {
        scaffoldRef.current.visible = false;
      }
    }

    // Glass panels fade/slide in
    glassRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const appearAt = i / glassRef.current.length;
      const local = THREE.MathUtils.clamp((glassP - appearAt) * 2.2, 0, 1);
      const eased = local * local * (3 - 2 * local);

      (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.05 + 0.65 * eased;
      mesh.position.z = THREE.MathUtils.lerp(0.65, 0.51, eased);
      mesh.visible = eased > 0.02;
    });

    // Roof animation
    if (roofRef.current) {
      roofRef.current.visible = roofP > 0.02;
      roofRef.current.scale.setScalar(THREE.MathUtils.lerp(0.5, 1.0, roofP));
      roofRef.current.position.y = THREE.MathUtils.lerp(floors * floorHeight, floors * floorHeight + 0.2, roofP);
    }
  });

  return (
    <group>
      {/* Dark core column */}
      <mesh castShadow material={mats.darkCore} position={[0, 0.85, 0]}>
        <boxGeometry args={[0.35, floors * floorHeight + 0.45, 0.25]} />
        <Edges lineWidth={1} color="#64748b" threshold={20} />
      </mesh>

      {/* Floors with structural frames and wireframe edge overlays */}
      <group>
        {Array.from({ length: floors }).map((_, i) => (
          <group
            key={`floor-group-${i}`}
            ref={(el) => { floorsRef.current[i] = el; }}
            position={[0, -0.8, 0]}
            visible={false}
          >
            {/* Concrete Slab */}
            <mesh castShadow material={mats.concrete}>
              <boxGeometry args={[1.6, 0.16, 1.05]} />
              <Edges lineWidth={1.8} color="#f97316" threshold={15} />
            </mesh>

            {/* Truss frames (only on lower segments of each floor) */}
            {i < floors - 1 && (
              <FloorStructuralFrames y={0.08} mats={mats} />
            )}
          </group>
        ))}
      </group>

      {/* Scaffolding Frame */}
      <group ref={scaffoldRef} visible={false}>
        {/* Scaffolding pipe lattice */}
        <mesh material={mats.orange}>
          {/* Vertical poles */}
          <boxGeometry args={[1.65, 0.4, 1.1]} />
          <Edges lineWidth={2} color="#ffffff" threshold={5} />
        </mesh>
      </group>

      {/* Glass facade panels with edge lines */}
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
            <boxGeometry args={[1.58, 0.11, 0.02]} />
            <Edges lineWidth={1.2} color="#3b82f6" threshold={15} />
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
        <boxGeometry args={[1.72, 0.08, 1.12]} />
        <Edges lineWidth={2} color="#3b82f6" threshold={15} />
      </mesh>
    </group>
  );
};

// Crane with diagonal truss structures
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
    <group ref={craneRef} position={[1.35, 0.0, -0.6]} visible={false}>
      {/* Base cylinder */}
      <mesh castShadow material={mats.steel} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.3, 16]} />
      </mesh>
      {/* Crane Tower (Truss frame) */}
      <mesh castShadow material={mats.orange} position={[0, 1.2, 0]}>
        <boxGeometry args={[0.1, 2.0, 0.1]} />
        <Edges lineWidth={1.5} color="#ffffff" threshold={10} />
      </mesh>
      {/* Main Boom Arm (Truss) */}
      <mesh castShadow material={mats.orange} position={[0.75, 2.15, 0]}>
        <boxGeometry args={[1.6, 0.08, 0.08]} />
        <Edges lineWidth={1.5} color="#ffffff" threshold={10} />
      </mesh>
      {/* Counterweight boom */}
      <mesh castShadow material={mats.steel} position={[-0.35, 2.15, 0]}>
        <boxGeometry args={[0.6, 0.06, 0.06]} />
      </mesh>
      {/* Heavy cable */}
      <mesh material={mats.steel} position={[1.4, 1.45, 0]}>
        <boxGeometry args={[0.008, 1.4, 0.008]} />
      </mesh>
      {/* Crane Hook */}
      <group position={[1.4, 0.75, 0]}>
        <mesh castShadow material={mats.steel}>
          <torusGeometry args={[0.045, 0.015, 8, 20]} />
        </mesh>
      </group>
    </group>
  );
};

// Perimeter safety rails
const PerimeterRails = ({ mats }: { mats: ReturnType<typeof useMaterials> }) => {
  const railY = 0.22;
  return (
    <group position={[0, railY, 0]}>
      <mesh castShadow material={mats.orange} position={[0, 0.08, 0.62]}>
        <boxGeometry args={[2.0, 0.02, 0.02]} />
      </mesh>
      <mesh castShadow material={mats.orange} position={[0, 0.08, -0.62]}>
        <boxGeometry args={[2.0, 0.02, 0.02]} />
      </mesh>
      <mesh castShadow material={mats.orange} position={[1.0, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.02, 1.25]} />
      </mesh>
      <mesh castShadow material={mats.orange} position={[-1.0, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.02, 1.25]} />
      </mesh>
    </group>
  );
};

// Main scene building
const SceneBuilding = () => {
  const group = useRef<THREE.Group>(null);
  const crane = useRef<THREE.Group>(null);
  const tRef = useRef(0);

  const floors = 6;
  const floorHeight = 0.35;

  const materials = useMaterials();

  // Dynamically compute active y-level for sparks
  const activeYSparks = useMemo(() => {
    // Return approximate height of active welding floor
    return 0.4;
  }, []);

  useFrame((state, delta) => {
    // Slow presentation orbit rotation
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.18) * 0.25,
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -0.08,
        0.06
      );
    }

    // Construction progress timeline
    const duration = 10.0;
    tRef.current += delta;
    const loopT = (tRef.current % duration) / duration;

    // Crane boom swing animation
    if (crane.current) {
      const swing = Math.sin(state.clock.elapsedTime * 1.0) * 0.15;
      crane.current.rotation.z = swing;
      crane.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }

    // Update progress on userData for child core to read
    if (group.current) group.current.userData.progress = loopT;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]} scale={1.05}>
      {/* Ground plinth base */}
      <mesh receiveShadow position={[0, -0.1, 0]} material={materials.concrete}>
        <boxGeometry args={[3.0, 0.12, 2.0]} />
        <Edges lineWidth={1.5} color="#475569" threshold={15} />
      </mesh>

      {/* Building core column, slabs, trusses */}
      <BuildingCore 
        floors={floors} 
        floorHeight={floorHeight} 
        mats={materials} 
        parentRef={group} 
      />

      {/* Crane arm */}
      <Crane mats={materials} craneRef={crane} parentRef={group} />

      {/* Safety rails */}
      <PerimeterRails mats={materials} />

      {/* Welding sparks point particles */}
      <WeldingSparks activeY={activeYSparks} />
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
        camera={{ position: [3.4, 2.0, 5.0], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[5, 7, 3]}
          intensity={1.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 3, -3]} intensity={0.3} />
        
        <Environment preset="city" />

        <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.15}>
          <SceneBuilding />
        </Float>

        <ContactShadows
          position={[0, -0.2, 0]}
          opacity={0.4}
          scale={7}
          blur={2.0}
          far={5}
        />
      </Canvas>
    </div>
  );
};

export default ConstructionBuilding;
