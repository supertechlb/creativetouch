import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// Materials factory
const useMaterials = () => {
  return useMemo(() => ({
    // Feather colors (geometric low-poly style)
    featherBlue: new THREE.MeshStandardMaterial({
      color: '#2f61d5',
      roughness: 0.3,
      metalness: 0.2,
    }),
    featherTeal: new THREE.MeshStandardMaterial({
      color: '#2bb6b0',
      roughness: 0.3,
      metalness: 0.2,
    }),
    featherRed: new THREE.MeshStandardMaterial({
      color: '#e84b4b',
      roughness: 0.3,
      metalness: 0.2,
    }),
    featherOrange: new THREE.MeshStandardMaterial({
      color: '#ff7a18',
      roughness: 0.3,
      metalness: 0.2,
    }),
    featherYellow: new THREE.MeshStandardMaterial({
      color: '#f7b731',
      roughness: 0.3,
      metalness: 0.2,
    }),
    featherPink: new THREE.MeshStandardMaterial({
      color: '#d946ef',
      roughness: 0.3,
      metalness: 0.2,
    }),
    // Orange building
    orange: new THREE.MeshStandardMaterial({
      color: '#ff7a18',
      roughness: 0.35,
      metalness: 0.25,
      emissive: new THREE.Color('#ff5a00'),
      emissiveIntensity: 0.08,
    }),
    orangeLight: new THREE.MeshStandardMaterial({
      color: '#ffb347',
      roughness: 0.35,
      metalness: 0.2,
    }),
    // Blue tower
    blue: new THREE.MeshStandardMaterial({
      color: '#2f61d5',
      roughness: 0.3,
      metalness: 0.3,
    }),
    blueLight: new THREE.MeshStandardMaterial({
      color: '#5b8def',
      roughness: 0.3,
      metalness: 0.25,
    }),
    white: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.5,
      metalness: 0.1,
    }),
  }), []);
};

// Feather component - geometric low-poly style
const Feather = ({ 
  mats, 
  progress 
}: { 
  mats: ReturnType<typeof useMaterials>; 
  progress: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const piecesRef = useRef<(THREE.Mesh | null)[]>([]);

  // Feather segments from top to bottom
  const featherPieces = useMemo(() => [
    // Top segments (blue/teal)
    { pos: [0, 1.4, 0], scale: [0.3, 0.25, 0.15], rot: [0, 0, 0.1], mat: 'featherBlue' },
    { pos: [0.1, 1.2, 0], scale: [0.35, 0.22, 0.15], rot: [0, 0, -0.05], mat: 'featherTeal' },
    { pos: [-0.05, 1.0, 0], scale: [0.4, 0.2, 0.15], rot: [0, 0, 0.08], mat: 'featherBlue' },
    // Middle segments (teal/pink)
    { pos: [0.08, 0.8, 0], scale: [0.42, 0.22, 0.15], rot: [0, 0, -0.03], mat: 'featherTeal' },
    { pos: [-0.02, 0.6, 0], scale: [0.38, 0.2, 0.15], rot: [0, 0, 0.05], mat: 'featherPink' },
    { pos: [0.1, 0.4, 0], scale: [0.35, 0.22, 0.15], rot: [0, 0, -0.08], mat: 'featherRed' },
    // Lower segments (orange/red/yellow)
    { pos: [0, 0.2, 0], scale: [0.32, 0.2, 0.15], rot: [0, 0, 0.03], mat: 'featherOrange' },
    { pos: [0.05, 0, 0], scale: [0.28, 0.18, 0.15], rot: [0, 0, -0.05], mat: 'featherYellow' },
    { pos: [-0.02, -0.18, 0], scale: [0.22, 0.16, 0.15], rot: [0, 0, 0.02], mat: 'featherRed' },
    // Stem
    { pos: [0.02, -0.5, 0], scale: [0.06, 0.5, 0.06], rot: [0, 0, 0.05], mat: 'featherRed' },
  ], []);

  useFrame(() => {
    const p = THREE.MathUtils.smoothstep(progress, 0.45, 0.75);
    
    piecesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const appearAt = i / featherPieces.length;
      const local = THREE.MathUtils.clamp((p - appearAt) * 2.5, 0, 1);
      const eased = local * local * (3 - 2 * local);
      
      const piece = featherPieces[i];
      const startY = piece.pos[1] + 1.5;
      const startX = piece.pos[0] + (Math.sin(i * 1.5) * 0.8);
      
      mesh.position.x = THREE.MathUtils.lerp(startX, piece.pos[0], eased);
      mesh.position.y = THREE.MathUtils.lerp(startY, piece.pos[1], eased);
      mesh.scale.setScalar(THREE.MathUtils.lerp(0.1, 1, eased));
      mesh.visible = local > 0.01;
      
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.opacity = eased;
        mesh.material.transparent = true;
      }
    });
  });

  return (
    <group ref={groupRef} position={[-1.8, 0, 0]}>
      {featherPieces.map((piece, i) => (
        <mesh
          key={i}
          ref={(el) => { piecesRef.current[i] = el; }}
          castShadow
          material={mats[piece.mat as keyof ReturnType<typeof useMaterials>]}
          position={[piece.pos[0], piece.pos[1], piece.pos[2]]}
          rotation={[piece.rot[0], piece.rot[1], piece.rot[2]]}
          visible={false}
        >
          <boxGeometry args={[piece.scale[0], piece.scale[1], piece.scale[2]]} />
        </mesh>
      ))}
    </group>
  );
};

// Orange Building bars component
const OrangeBuilding = ({ 
  mats, 
  progress 
}: { 
  mats: ReturnType<typeof useMaterials>; 
  progress: number;
}) => {
  const barsRef = useRef<(THREE.Mesh | null)[]>([]);
  
  const bars = useMemo(() => {
    const result = [];
    // Main building bars (horizontal stripes)
    for (let i = 0; i < 8; i++) {
      const isOdd = i % 2 === 1;
      result.push({
        pos: [0, -0.7 + i * 0.25, 0],
        scale: [0.5, 0.12, 0.3],
        mat: isOdd ? 'orangeLight' : 'orange',
      });
    }
    // Top cap (gradient to yellow)
    result.push({
      pos: [0, 1.35, 0],
      scale: [0.45, 0.15, 0.28],
      mat: 'orangeLight',
    });
    return result;
  }, []);

  useFrame(() => {
    const p = THREE.MathUtils.smoothstep(progress, 0.20, 0.45);
    
    barsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const appearAt = i / bars.length;
      const local = THREE.MathUtils.clamp((p - appearAt) * 2.2, 0, 1);
      const eased = local * local * (3 - 2 * local);
      
      const bar = bars[i];
      const startX = bar.pos[0] - 1.5;
      
      mesh.position.x = THREE.MathUtils.lerp(startX, bar.pos[0], eased);
      mesh.position.y = bar.pos[1];
      mesh.scale.x = THREE.MathUtils.lerp(0.1, 1, eased);
      mesh.scale.y = THREE.MathUtils.lerp(0.3, 1, eased);
      mesh.visible = local > 0.01;
      
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.opacity = eased;
        mesh.material.transparent = true;
      }
    });
  });

  return (
    <group position={[-0.3, 0, 0]}>
      {bars.map((bar, i) => (
        <mesh
          key={i}
          ref={(el) => { barsRef.current[i] = el; }}
          castShadow
          material={mats[bar.mat as keyof ReturnType<typeof useMaterials>]}
          visible={false}
        >
          <boxGeometry args={[bar.scale[0], bar.scale[1], bar.scale[2]]} />
        </mesh>
      ))}
    </group>
  );
};

// Blue Tower with wave curves
const BlueTower = ({ 
  mats, 
  progress 
}: { 
  mats: ReturnType<typeof useMaterials>; 
  progress: number;
}) => {
  const piecesRef = useRef<(THREE.Mesh | null)[]>([]);
  
  // Tower pieces: curved base, wave stripes, outer arc
  const pieces = useMemo(() => {
    const result = [];
    
    // Base foundation
    result.push({
      pos: [0.5, -0.8, 0],
      scale: [1.2, 0.15, 0.4],
      rot: [0, 0, 0],
      mat: 'blue',
      type: 'box',
    });
    
    // Vertical pillars
    for (let i = 0; i < 5; i++) {
      result.push({
        pos: [0.2 + i * 0.22, -0.3, 0],
        scale: [0.08, 0.8, 0.25],
        rot: [0, 0, 0],
        mat: 'white',
        type: 'box',
      });
    }
    
    // Wave curves (arc segments)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 0.5;
      const radius = 0.9 + i * 0.12;
      result.push({
        pos: [0.5 + Math.cos(angle) * radius * 0.3, 0.2 + Math.sin(angle) * radius * 0.8, 0],
        scale: [0.8 - i * 0.1, 0.08, 0.2],
        rot: [0, 0, -angle * 0.3],
        mat: i % 2 === 0 ? 'blue' : 'white',
        type: 'box',
      });
    }
    
    // Outer curved tower
    result.push({
      pos: [1.1, 0.5, 0],
      scale: [0.25, 1.8, 0.35],
      rot: [0, 0, 0.15],
      mat: 'blueLight',
      type: 'box',
    });
    
    // Top curve accent
    result.push({
      pos: [0.9, 1.3, 0],
      scale: [0.6, 0.12, 0.3],
      rot: [0, 0, -0.2],
      mat: 'blue',
      type: 'box',
    });
    
    return result;
  }, []);

  useFrame(() => {
    const p = THREE.MathUtils.smoothstep(progress, 0.02, 0.20);
    
    piecesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const appearAt = i / pieces.length;
      const local = THREE.MathUtils.clamp((p - appearAt) * 2.0, 0, 1);
      const eased = local * local * (3 - 2 * local);
      
      const piece = pieces[i];
      const startY = piece.pos[1] - 1.5;
      
      mesh.position.x = piece.pos[0];
      mesh.position.y = THREE.MathUtils.lerp(startY, piece.pos[1], eased);
      mesh.position.z = piece.pos[2];
      mesh.rotation.set(piece.rot[0], piece.rot[1], piece.rot[2]);
      mesh.scale.setScalar(THREE.MathUtils.lerp(0.2, 1, eased));
      mesh.visible = local > 0.01;
      
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.opacity = eased;
        mesh.material.transparent = true;
      }
    });
  });

  return (
    <group position={[0.6, 0, 0]}>
      {pieces.map((piece, i) => (
        <mesh
          key={i}
          ref={(el) => { piecesRef.current[i] = el; }}
          castShadow
          material={mats[piece.mat as keyof ReturnType<typeof useMaterials>]}
          visible={false}
        >
          <boxGeometry args={[piece.scale[0], piece.scale[1], piece.scale[2]]} />
        </mesh>
      ))}
    </group>
  );
};

// Shine effect overlay
const ShineEffect = ({ progress }: { progress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    const shineP = THREE.MathUtils.smoothstep(progress, 0.75, 0.90);
    if (meshRef.current) {
      meshRef.current.visible = shineP > 0.01 && shineP < 0.99;
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(shineP * Math.PI) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.3, 0.5]} visible={false}>
      <planeGeometry args={[5, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  );
};

// Main scene
const LogoScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(0);
  
  const materials = useMaterials();

  useFrame((state, delta) => {
    // Slow presentation rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.25) * 0.18,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.05,
        0.05
      );
    }

    // Animation timeline loop (7.5 seconds)
    const duration = 7.5;
    tRef.current += delta;
    const progress = (tRef.current % duration) / duration;
    
    // Store progress for children
    if (groupRef.current) {
      groupRef.current.userData.progress = progress;
    }
  });

  return (
    <group ref={groupRef} scale={0.9}>
      <BlueTower mats={materials} progress={groupRef.current?.userData?.progress ?? 0} />
      <OrangeBuilding mats={materials} progress={groupRef.current?.userData?.progress ?? 0} />
      <Feather mats={materials} progress={groupRef.current?.userData?.progress ?? 0} />
      <ShineEffect progress={groupRef.current?.userData?.progress ?? 0} />
    </group>
  );
};

// Wrapper that reads progress from parent
const AnimatedLogoScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(0);
  const progressRef = useRef(0);
  
  const materials = useMaterials();

  useFrame((state, delta) => {
    // Slow presentation rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.25) * 0.18,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.05,
        0.05
      );
    }

    // Animation timeline loop (7.5 seconds)
    const duration = 7.5;
    tRef.current += delta;
    progressRef.current = (tRef.current % duration) / duration;
  });

  return (
    <group ref={groupRef} scale={0.9}>
      <ProgressReader progressRef={progressRef} materials={materials} />
    </group>
  );
};

const ProgressReader = ({ 
  progressRef, 
  materials 
}: { 
  progressRef: React.MutableRefObject<number>;
  materials: ReturnType<typeof useMaterials>;
}) => {
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    setProgress(progressRef.current);
  });

  return (
    <>
      <BlueTower mats={materials} progress={progress} />
      <OrangeBuilding mats={materials} progress={progress} />
      <Feather mats={materials} progress={progress} />
      <ShineEffect progress={progress} />
    </>
  );
};

// Need to import useState
import { useState } from 'react';

// Main exported component
const LogoBuild3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0.5, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[5, 8, 5]}
          intensity={1.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 4, -3]} intensity={0.4} />
        <pointLight position={[0, 2, 3]} intensity={0.3} color="#ffffff" />
        
        <Environment preset="city" />

        <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.2}>
          <AnimatedLogoScene />
        </Float>

        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={5}
        />
      </Canvas>
    </div>
  );
};

export default LogoBuild3D;
