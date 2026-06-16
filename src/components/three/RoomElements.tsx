import React, { useState } from 'react';
import { useBuilderStore, Wall as WallType, Floor as FloorType, Furniture as FurnitureType } from '../../stores/useBuilderStore';
import { PivotControls, Edges, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';

export const Wall = ({ wall }: { wall: WallType }) => {
  const { selectedId, setSelectedId } = useBuilderStore();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const length = Math.hypot(wall.end[0] - wall.start[0], wall.end[1] - wall.start[1]);
  const angle = Math.atan2(wall.end[1] - wall.start[1], wall.end[0] - wall.start[0]);
  const midX = (wall.start[0] + wall.end[0]) / 2;
  const midZ = (wall.start[1] + wall.end[1]) / 2;

  const isSelected = selectedId === wall.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(wall.id);
  };

  return (
    <mesh
      position={[midX, wall.height / 2, midZ]}
      rotation={[0, -angle, 0]}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, wall.height, wall.thickness]} />
      <meshStandardMaterial color={isSelected ? '#add8e6' : wall.color} />
      {isSelected && <Edges color="blue" />}
    </mesh>
  );
};

export const Floor = ({ floor }: { floor: FloorType }) => {
  const { selectedId, setSelectedId } = useBuilderStore();
  const isSelected = selectedId === floor.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(floor.id);
  };

  return (
    <mesh
      position={[floor.position[0], -0.05, floor.position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={handleClick}
      receiveShadow
    >
      <planeGeometry args={[floor.width, floor.depth]} />
      <meshStandardMaterial color={isSelected ? '#f5deb3' : floor.color} />
      {isSelected && <Edges color="orange" />}
    </mesh>
  );
};

export const Furniture = ({ item }: { item: FurnitureType }) => {
  const { selectedId, setSelectedId, updateFurniture } = useBuilderStore();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const isSelected = selectedId === item.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedId(item.id);
  };

  const handleDrag = (local: THREE.Matrix4) => {
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    local.decompose(position, rotation, scale);
    const euler = new THREE.Euler().setFromQuaternion(rotation);

    updateFurniture(item.id, {
      position: [position.x, position.y, position.z],
      rotation: [euler.x, euler.y, euler.z]
    });
  };

  let geometry;
  switch (item.type) {
    case 'sofa':
      geometry = <boxGeometry args={[item.scale[0], item.scale[1], item.scale[2]]} />;
      break;
    case 'table':
      geometry = <cylinderGeometry args={[item.scale[0] / 2, item.scale[0] / 2, item.scale[1], 32]} />;
      break;
    case 'chair':
      geometry = <boxGeometry args={[item.scale[0], item.scale[1], item.scale[2]]} />;
      break;
    case 'lamp':
      geometry = <cylinderGeometry args={[0.1, 0.4, item.scale[1], 16]} />;
      break;
    case 'bed':
      geometry = <boxGeometry args={[item.scale[0], item.scale[1], item.scale[2]]} />;
      break;
    default:
      geometry = <boxGeometry args={[item.scale[0], item.scale[1], item.scale[2]]} />;
  }

  const content = (
    <mesh
      position={item.position}
      rotation={item.rotation}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {geometry}
      <meshStandardMaterial color={isSelected ? '#ffb6c1' : item.color} />
      {isSelected && <Edges color="red" />}
    </mesh>
  );

  if (isSelected) {
    return (
      <PivotControls
        activeAxes={[true, false, true]} // mostly move on floor (X, Z)
        onDrag={(l, deltaL, w, deltaW) => {
           const pos = new THREE.Vector3();
           w.decompose(pos, new THREE.Quaternion(), new THREE.Vector3());
           updateFurniture(item.id, { position: [pos.x, item.position[1], pos.z] });
        }}
        onDragEnd={() => {}}
      >
        {content}
      </PivotControls>
    );
  }

  return content;
};
