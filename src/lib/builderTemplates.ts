import { Wall, Floor, Furniture } from '../stores/useBuilderStore';

const generateId = () => Math.random().toString(36).substring(2, 9);

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  data: {
    walls: Wall[];
    floors: Floor[];
    furniture: Furniture[];
  };
}

// Helper to create a basic enclosed rectangular room
const createRectRoom = (width: number, depth: number, height: number = 3): { walls: Wall[]; floor: Floor } => {
  const halfW = width / 2;
  const halfD = depth / 2;
  const thickness = 0.2;
  const color = '#f0f0f0';

  const walls: Wall[] = [
    { id: generateId(), start: [-halfW, -halfD], end: [halfW, -halfD], height, thickness, color },
    { id: generateId(), start: [halfW, -halfD], end: [halfW, halfD], height, thickness, color },
    { id: generateId(), start: [halfW, halfD], end: [-halfW, halfD], height, thickness, color },
    { id: generateId(), start: [-halfW, halfD], end: [-halfW, -halfD], height, thickness, color },
  ];

  const floor: Floor = {
    id: generateId(),
    width,
    depth,
    position: [0, 0, 0],
    color: '#dcdcdc'
  };

  return { walls, floor };
};

const t1Room = createRectRoom(6, 4);
const t2Room = createRectRoom(8, 6);
const t3Room = createRectRoom(5, 5);
const t4Room = createRectRoom(10, 5);
const t5Room = createRectRoom(7, 7);
const t6Room = createRectRoom(4, 4);
const t7Room = createRectRoom(12, 8);
const t8Room = createRectRoom(6, 8);
const t9Room = createRectRoom(5, 7);
const t10Room = createRectRoom(8, 8);

export const builderTemplates: Template[] = [
  {
    id: 't1',
    name: 'Minimalist Living',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t1Room.walls,
      floors: [t1Room.floor],
      furniture: [
        { id: generateId(), type: 'sofa', position: [0, 0, 0], rotation: [0, 0, 0], scale: [2, 0.8, 0.9], color: '#d1cbbd' },
        { id: generateId(), type: 'table', position: [0, 0, 1.2], rotation: [0, 0, 0], scale: [1.2, 0.4, 0.6], color: '#8b5a2b' },
        { id: generateId(), type: 'lamp', position: [-2, 0, -1], rotation: [0, 0, 0], scale: [0.4, 1.8, 0.4], color: '#1a1a1a' }
      ]
    }
  },
  {
    id: 't2',
    name: 'Executive Office',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t2Room.walls,
      floors: [{ ...t2Room.floor, color: '#3b3b3b' }],
      furniture: [
        { id: generateId(), type: 'table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [2.5, 0.75, 1], color: '#2a2a2a' },
        { id: generateId(), type: 'chair', position: [0, 0, -1], rotation: [0, 0, 0], scale: [0.6, 1.2, 0.6], color: '#111111' },
      ]
    }
  },
  {
    id: 't3',
    name: 'Cozy Bedroom',
    thumbnail: 'https://images.unsplash.com/photo-1522771731550-bdf19cebe863?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t3Room.walls,
      floors: [t3Room.floor],
      furniture: [
        { id: generateId(), type: 'bed', position: [0, 0, -1.5], rotation: [0, 0, 0], scale: [2, 0.6, 2.2], color: '#e0e0e0' },
        { id: generateId(), type: 'table', position: [-1.5, 0, -2], rotation: [0, 0, 0], scale: [0.5, 0.5, 0.5], color: '#fff' }
      ]
    }
  },
  {
    id: 't4',
    name: 'Open Plan Studio',
    thumbnail: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t4Room.walls,
      floors: [t4Room.floor],
      furniture: [
        { id: generateId(), type: 'sofa', position: [-2, 0, 0], rotation: [0, Math.PI / 2, 0], scale: [2.5, 0.8, 0.9], color: '#7a8b99' },
        { id: generateId(), type: 'bed', position: [3, 0, 0], rotation: [0, 0, 0], scale: [2, 0.6, 2], color: '#c4b5a3' }
      ]
    }
  },
  {
    id: 't5',
    name: 'Luxury Lounge',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t5Room.walls,
      floors: [{ ...t5Room.floor, color: '#2c2c2c' }],
      furniture: [
        { id: generateId(), type: 'sofa', position: [0, 0, 1], rotation: [0, Math.PI, 0], scale: [3, 0.8, 1], color: '#8a2be2' },
        { id: generateId(), type: 'chair', position: [-2, 0, -1], rotation: [0, Math.PI / 4, 0], scale: [0.8, 0.9, 0.8], color: '#d4af37' },
        { id: generateId(), type: 'chair', position: [2, 0, -1], rotation: [0, -Math.PI / 4, 0], scale: [0.8, 0.9, 0.8], color: '#d4af37' }
      ]
    }
  },
  {
    id: 't6',
    name: 'Compact Kitchen',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t6Room.walls,
      floors: [{ ...t6Room.floor, color: '#f5f5dc' }],
      furniture: [
        { id: generateId(), type: 'table', position: [0, 0, -1], rotation: [0, 0, 0], scale: [3, 0.9, 0.6], color: '#ffffff' }, // Counter
        { id: generateId(), type: 'table', position: [0, 0, 1], rotation: [0, 0, 0], scale: [1.5, 0.9, 0.8], color: '#8b4513' }  // Island
      ]
    }
  },
  {
    id: 't7',
    name: 'Grand Ballroom',
    thumbnail: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t7Room.walls,
      floors: [{ ...t7Room.floor, color: '#e6dac3' }],
      furniture: [
        { id: generateId(), type: 'lamp', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 3, 1.5], color: '#ffd700' } // Chandelier placeholder
      ]
    }
  },
  {
    id: 't8',
    name: 'Modern Dining',
    thumbnail: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t8Room.walls,
      floors: [{ ...t8Room.floor, color: '#d3d3d3' }],
      furniture: [
        { id: generateId(), type: 'table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [2.5, 0.75, 1.2], color: '#4a4a4a' },
        { id: generateId(), type: 'chair', position: [-1, 0, -0.8], rotation: [0, 0, 0], scale: [0.5, 1, 0.5], color: '#2b2b2b' },
        { id: generateId(), type: 'chair', position: [1, 0, -0.8], rotation: [0, 0, 0], scale: [0.5, 1, 0.5], color: '#2b2b2b' },
        { id: generateId(), type: 'chair', position: [-1, 0, 0.8], rotation: [0, Math.PI, 0], scale: [0.5, 1, 0.5], color: '#2b2b2b' },
        { id: generateId(), type: 'chair', position: [1, 0, 0.8], rotation: [0, Math.PI, 0], scale: [0.5, 1, 0.5], color: '#2b2b2b' }
      ]
    }
  },
  {
    id: 't9',
    name: 'Home Theater',
    thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t9Room.walls,
      floors: [{ ...t9Room.floor, color: '#1a1a1a' }],
      furniture: [
        { id: generateId(), type: 'sofa', position: [0, 0, 2], rotation: [0, 0, 0], scale: [4, 0.8, 1], color: '#b22222' },
        { id: generateId(), type: 'table', position: [0, 0, -2], rotation: [0, 0, 0], scale: [3, 1.5, 0.2], color: '#000000' } // TV screen placeholder
      ]
    }
  },
  {
    id: 't10',
    name: 'Sunroom',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    data: {
      walls: t10Room.walls,
      floors: [{ ...t10Room.floor, color: '#fdf5e6' }],
      furniture: [
        { id: generateId(), type: 'chair', position: [-1.5, 0, 0], rotation: [0, Math.PI / 4, 0], scale: [0.8, 0.9, 0.8], color: '#98fb98' },
        { id: generateId(), type: 'chair', position: [1.5, 0, 0], rotation: [0, -Math.PI / 4, 0], scale: [0.8, 0.9, 0.8], color: '#98fb98' },
        { id: generateId(), type: 'table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [0.8, 0.4, 0.8], color: '#deb887' }
      ]
    }
  }
];
