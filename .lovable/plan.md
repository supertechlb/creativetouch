
# Refine Feather Segments for Faceted Crystal Look

## Current Issue
The feather segments are spaced too far apart vertically, creating visible gaps between the diamond shapes. In the original logo, the feather has a continuous, faceted crystal appearance where segments overlap and blend into each other.

## Proposed Changes

### 1. Adjust Segment Positions (Tighter Vertical Spacing)
Reduce the vertical distance between segments from ~0.7-0.8 units to ~0.55-0.6 units so the diamond shapes visually overlap.

**Current positions:** 2.8, 2.0, 1.2, 0.4, -0.5, -1.3, -2.0  
**New positions:** 2.4, 1.85, 1.3, 0.75, 0.2, -0.35, -0.9 (tighter spacing)

### 2. Increase Segment Scales
Make the diamonds taller (larger Y scale) so they overlap more when positioned closer together.

**Current scales (Y):** 0.6, 0.7, 0.8, 0.85, 0.8, 0.7, 0.55  
**New scales (Y):** 0.75, 0.9, 1.0, 1.1, 1.0, 0.85, 0.65

### 3. Refine the Curved Spine
Adjust the X positions and rotations to create a smoother S-curve that matches the original logo's feather silhouette.

### 4. Adjust Quill Stem Position
Move the quill stem to align with the new, more compact feather shape.

---

## Technical Details

### File to Modify
`src/components/three/LogoBuild3D.tsx`

### Code Changes

**Update the segments array in the `Feather` component (lines 101-109):**

```typescript
const segments = [
  { color: '#c850c0', pos: [0.3, 2.4, 0], rot: [0, 0, 0.4], scale: [0.55, 0.75, 0.18] },   // Magenta tip
  { color: '#36d1dc', pos: [0.05, 1.85, 0], rot: [0, 0, 0.28], scale: [0.7, 0.9, 0.18] },  // Cyan
  { color: '#20b2aa', pos: [-0.15, 1.3, 0], rot: [0, 0, 0.15], scale: [0.8, 1.0, 0.18] },  // Teal
  { color: '#48c9b0', pos: [-0.25, 0.75, 0], rot: [0, 0, 0], scale: [0.85, 1.1, 0.18] },   // Light teal (largest)
  { color: '#f39c12', pos: [-0.2, 0.2, 0], rot: [0, 0, -0.12], scale: [0.8, 1.0, 0.18] },  // Orange
  { color: '#e74c3c', pos: [-0.05, -0.35, 0], rot: [0, 0, -0.25], scale: [0.7, 0.85, 0.18] }, // Red
  { color: '#c0392b', pos: [0.15, -0.9, 0], rot: [0, 0, -0.38], scale: [0.5, 0.65, 0.18] }, // Dark red tip
];
```

**Update the feather group position (line 112):**
```typescript
<group position={[-2.6, 0.1, 0]}>
```

**Update the quill stem position (line 130):**
```typescript
<mesh position={[0.25, -1.6, 0]} rotation={[0, 0, -0.2]}>
  <cylinderGeometry args={[0.05, 0.025, 1.4, 8]} />
```

---

## Visual Result
- Segments will overlap by approximately 30-40%, creating a continuous faceted crystal appearance
- The curved S-shape of the feather will be more pronounced
- The overall feather will be slightly more compact but with larger individual facets
- The diamond segments will catch light in a more cohesive way, resembling polished gemstone facets
