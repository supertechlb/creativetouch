import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Float } from "@react-three/drei";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
type PartTag = "feather" | "orange" | "blue" | "other";

const ORANGE = new THREE.Color("#F47C20"); // closer to your logo orange
const BLUE = new THREE.Color("#2F5BD3"); // closer to your logo blue

export default function LogoBuild3D({
  className = "w-full h-[420px]",
  svgUrl = "/assets/creative-touch-logo.svg",
}: {
  className?: string;
  svgUrl?: string;
}) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0.9, 5.0], fov: 38 }}>
        <color attach="background" args={["#ffffff"]} />

        {/* Lighting tuned for glossy but still “real” */}
        <ambientLight intensity={0.55} />
        <directionalLight
          castShadow
          position={[6, 8, 5]}
          intensity={1.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 2, -4]} intensity={0.35} />

        <Environment preset="studio" />

        <Float speed={0.6} floatIntensity={0.18} rotationIntensity={0.12}>
          <Center>
            <LogoExtrudedAnimated svgUrl={svgUrl} />
          </Center>
        </Float>

        <ContactShadows position={[0, -1.35, 0]} opacity={0.4} scale={10} blur={2.4} far={10} />
      </Canvas>
    </div>
  );
}

function LogoExtrudedAnimated({ svgUrl }: { svgUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const svg = useLoader(SVGLoader, svgUrl);

  /**
   * Build 3D meshes from SVG paths.
   * This is what makes it match your original logo shape.
   */
  const built = useMemo(() => {
    const root = new THREE.Group();
    const meshes: { mesh: THREE.Mesh; tag: PartTag; order: number }[] = [];

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.012,
      bevelSegments: 2,
    };

    // Build each SVG path into one or more meshes
    svg.paths.forEach((p, idx) => {
      const shapes = SVGLoader.createShapes(p);

      // SVG fill color if present (best)
      const fill = (p.userData?.style?.fill || "").toString().toLowerCase();
      const stroke = (p.userData?.style?.stroke || "").toString().toLowerCase();

      const color = pickBestColor(fill, stroke, idx);

      // Decide which major part this shape belongs to (for animation ordering)
      const tag = classifyTag(color);

      // Use a slightly different material per group for realism
      const mat = materialFor(color, tag);

      shapes.forEach((shape, sIdx) => {
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.computeVertexNormals();

        const m = new THREE.Mesh(geom, mat);
        m.castShadow = true;
        m.receiveShadow = false;

        // Order of assembly: blue -> orange -> feather -> details
        const order = tag === "blue" ? 0 : tag === "orange" ? 1 : tag === "feather" ? 2 : 3;

        meshes.push({ mesh: m, tag, order: order * 1000 + idx * 10 + sIdx });
        root.add(m);
      });
    });

    // Center and scale the whole logo to a nice hero size
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.4 / maxDim; // fits hero nicely
    root.scale.setScalar(scale);

    // Give it a slight 3D tilt like the original “badge”
    root.rotation.x = -0.14;
    root.rotation.y = 0.18;

    // Sort meshes by build order
    meshes.sort((a, b) => a.order - b.order);

    return { root, meshes };
  }, [svg]);

  // Animation loop: assemble -> hold -> reset
  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    // Gentle showroom rotation
    g.rotation.y = 0.18 + Math.sin(state.clock.elapsedTime * 0.25) * 0.12;

    const duration = 6.8; // build cycle
    const hold = 0.6; // hold when finished
    const total = duration + hold;

    const t = state.clock.elapsedTime % total;

    // 0..1 while building, then stays 1 during hold
    const buildP = t < duration ? t / duration : 1;

    const { meshes } = built;

    meshes.forEach((item, i) => {
      const mesh = item.mesh;

      // stagger: each piece starts slightly after previous
      const start = (i / meshes.length) * 0.75; // 75% of timeline used for staggering
      const local = THREE.MathUtils.clamp((buildP - start) / 0.25, 0, 1);
      const eased = easeOutCubic(local);

      // spawn positions: come from above/side based on group
      const seed = i * 97.13;
      const sx = Math.sin(seed) * 0.7;
      const sy = 1.4 + Math.cos(seed * 0.7) * 0.6;
      const sz = 0.9;

      mesh.position.set(
        THREE.MathUtils.lerp(sx, 0, eased),
        THREE.MathUtils.lerp(sy, 0, eased),
        THREE.MathUtils.lerp(sz, 0, eased),
      );

      const s = THREE.MathUtils.lerp(0.02, 1.0, eased);
      mesh.scale.setScalar(s);

      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(0, 1, eased);

      // Quick “shine” near the end of build for realism
      const shine = smoothstep(buildP, 0.82, 0.98);
      mat.emissive = new THREE.Color("#ffffff");
      mat.emissiveIntensity = 0.08 * shine;
    });
  });

  return <primitive ref={groupRef} object={built.root} />;
}

function materialFor(color: THREE.Color, tag: PartTag) {
  // Slightly different surfaces: glassy-ish feather, solid for orange, glossy for blue
  if (tag === "feather") {
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
    });
  }
  if (tag === "blue") {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.22,
      metalness: 0.35,
    });
  }
  if (tag === "orange") {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.35,
      metalness: 0.18,
    });
  }
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.1,
  });
}

function colorDistance(c1: THREE.Color, c2: THREE.Color): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function classifyTag(color: THREE.Color): PartTag {
  // Compare closeness to the main logo colors
  const dO = colorDistance(color, ORANGE);
  const dB = colorDistance(color, BLUE);

  if (dO < 0.25) return "orange";
  if (dB < 0.25) return "blue";

  // Everything else (multi-color feather) falls here
  return "feather";
}

function pickBestColor(fill: string, stroke: string, idx: number) {
  // Best case: SVG paths keep original fills (recommended)
  if (fill && fill !== "none") {
    try {
      return new THREE.Color(fill);
    } catch {}
  }
  if (stroke && stroke !== "none") {
    try {
      return new THREE.Color(stroke);
    } catch {}
  }

  // Fallback: if SVG lost fills, we approximate by index (not perfect)
  // This is why providing a proper traced SVG is important.
  if (idx < 10) return BLUE.clone();
  if (idx < 20) return ORANGE.clone();

  const featherPalette = ["#22c55e", "#06b6d4", "#f97316", "#ef4444", "#a855f7", "#f59e0b"];
  return new THREE.Color(featherPalette[idx % featherPalette.length]);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function smoothstep(x: number, a: number, b: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}
