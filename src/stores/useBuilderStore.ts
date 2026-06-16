import { create } from 'zustand';

export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export interface Wall {
  id: string;
  start: Vector2;
  end: Vector2;
  height: number;
  thickness: number;
  color: string;
  texture?: string;
}

export interface Floor {
  id: string;
  width: number;
  depth: number;
  position: Vector3;
  color: string;
  texture?: string;
}

export interface Furniture {
  id: string;
  type: string; // 'sofa', 'table', 'chair', 'lamp', 'bed', etc.
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  color: string;
}

export interface BuilderState {
  viewMode: '2d' | '3d';
  walls: Wall[];
  floors: Floor[];
  furniture: Furniture[];
  selectedId: string | null;
  hoveredId: string | null;
  
  // Actions
  setViewMode: (mode: '2d' | '3d') => void;
  setSelectedId: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
  
  // Modifiers
  addWall: (wall: Omit<Wall, 'id'>) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  removeWall: (id: string) => void;
  
  addFloor: (floor: Omit<Floor, 'id'>) => void;
  updateFloor: (id: string, updates: Partial<Floor>) => void;
  
  addFurniture: (item: Omit<Furniture, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<Furniture>) => void;
  removeFurniture: (id: string) => void;
  
  loadTemplate: (template: { walls: Wall[]; floors: Floor[]; furniture: Furniture[] }) => void;
  clearScene: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useBuilderStore = create<BuilderState>((set) => ({
  viewMode: '3d',
  walls: [],
  floors: [],
  furniture: [],
  selectedId: null,
  hoveredId: null,
  
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedId: (id) => set({ selectedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
  
  addWall: (wall) => set((state) => ({ 
    walls: [...state.walls, { ...wall, id: generateId() }] 
  })),
  updateWall: (id, updates) => set((state) => ({
    walls: state.walls.map((w) => (w.id === id ? { ...w, ...updates } : w))
  })),
  removeWall: (id) => set((state) => ({
    walls: state.walls.filter((w) => w.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  addFloor: (floor) => set((state) => ({
    floors: [...state.floors, { ...floor, id: generateId() }]
  })),
  updateFloor: (id, updates) => set((state) => ({
    floors: state.floors.map((f) => (f.id === id ? { ...f, ...updates } : f))
  })),
  
  addFurniture: (item) => set((state) => ({
    furniture: [...state.furniture, { ...item, id: generateId() }]
  })),
  updateFurniture: (id, updates) => set((state) => ({
    furniture: state.furniture.map((f) => (f.id === id ? { ...f, ...updates } : f))
  })),
  removeFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter((f) => f.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  loadTemplate: (template) => set({
    walls: template.walls,
    floors: template.floors,
    furniture: template.furniture,
    selectedId: null,
  }),
  
  clearScene: () => set({
    walls: [],
    floors: [],
    furniture: [],
    selectedId: null,
  })
}));
