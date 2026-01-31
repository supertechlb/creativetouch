import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Center, Float } from "@react-three/drei";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
type PartTag = "feather" | "orange" | "blue" | "other";

const ORANGE = new THREE.Color("#F47C20");
const BLUE = new THREE.Color("#2F5BD3");

export default function LogoBuild3D({
  className = "w-full h-[420px]",
  svgUrl = "/assets/creative-touch-logo.svg",
}: {
  className?: string;
  svgUrl?: string;
}) {
  return (
    <div className={className}>
      <Canvas 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }} 
        camera={{ position: [0, 0.9, 5.0], fov: 38 }} 
        style={{ background: 'transparent' }}
      >
        {/* Bright direct lighting for saturated colors */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 3, -3]} intensity={0.8} />

        <Float speed={0.6} floatIntensity={0.18} rotationIntensity={0.12}>
          <Center>
            <LogoExtrudedAnimated svgUrl={svgUrl} />
          </Center>
        </Float>
      </Canvas>
    </div>
  );
}

function LogoExtrudedAnimated({ svgUrl }: { svgUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const svg = useLoader(SVGLoader, svgUrl);

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

    svg.paths.forEach((p, idx) => {
      const shapes = SVGLoader.createShapes(p);

      const fill = (p.userData?.style?.fill || "").toString().toLowerCase();
      const stroke = (p.userData?.style?.stroke || "").toString().toLowerCase();

      const color = pickBestColor(fill, stroke, idx);
      const tag = classifyTag(color);
      const mat = materialFor(color, tag);

      shapes.forEach((shape, sIdx) => {
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.computeVertexNormals();

        const m = new THREE.Mesh(geom, mat);

        const order = tag === "blue" ? 0 : tag === "orange" ? 1 : tag === "feather" ? 2 : 3;

        meshes.push({ mesh: m, tag, order: order * 1000 + idx * 10 + sIdx });
        root.add(m);
      });
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.4 / maxDim;
    root.scale.setScalar(scale);

    // Flip Y to correct SVG coordinate system
    root.scale.y *= -1;

    meshes.sort((a, b) => a.order - b.order);

    return { root, meshes };
  }, [svg]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    g.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;

    const duration = 6.8;
    const hold = 0.6;
    const total = duration + hold;

    const t = state.clock.elapsedTime % total;
    const buildP = t < duration ? t / duration : 1;

    const { meshes } = built;

    meshes.forEach((item, i) => {
      const mesh = item.mesh;

      const start = (i / meshes.length) * 0.75;
      const local = THREE.MathUtils.clamp((buildP - start) / 0.25, 0, 1);
      const eased = easeOutCubic(local);

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

      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(0, 1, eased);
    });
  });

  return <primitive ref={groupRef} object={built.root} />;
}

function materialFor(color: THREE.Color, tag: PartTag) {
  // Use MeshBasicMaterial for vibrant, unshaded colors (no lighting wash-out)
  return new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  });
}

function colorDistance(c1: THREE.Color, c2: THREE.Color): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function classifyTag(color: THREE.Color): PartTag {
  const dO = colorDistance(color, ORANGE);
  const dB = colorDistance(color, BLUE);

  if (dO < 0.25) return "orange";
  if (dB < 0.25) return "blue";

  return "feather";
}

function pickBestColor(fill: string, stroke: string, idx: number) {
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

  if (idx < 10) return BLUE.clone();
  if (idx < 20) return ORANGE.clone();

  const featherPalette = ["#22c55e", "#06b6d4", "#f97316", "#ef4444", "#a855f7", "#f59e0b"];
  return new THREE.Color(featherPalette[idx % featherPalette.length]);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
