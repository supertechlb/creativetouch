

# Upgraded 3D Construction Building Component

## Overview
Replace the current `ConstructionBuilding.tsx` with an enhanced procedural mini-building animation that features a realistic construction sequence (foundation → columns → floors → glass facade → roof), then pauses briefly and restarts in an infinite loop.

---

## Key Improvements Over Current Implementation

| Aspect | Current | New |
|--------|---------|-----|
| Animation Style | Floors rise/fall continuously | Sequential construction phases |
| Materials | Basic MeshStandardMaterial | Physical materials (glass transmission, emissive orange) |
| Lighting | Ambient + directional | Environment HDR + multiple directional lights |
| Construction Phases | Simple rise animation | Foundation → Floors → Glass → Roof sequence |
| Loop Behavior | 8-second rise/fall cycle | 10-second full construction cycle with hold |
| Realism | Functional | Premium with reflections, soft shadows |

---

## Animation Timeline (10-second loop)

```text
Time (s)  │ 0.0     2.0     4.0     6.0     8.0     10.0
          │  │       │       │       │       │       │
Phase     │  Foundation ──► Floors ──► Glass ──► Roof/Hold ──► Reset
Progress  │  0.00   0.15    0.55    0.85    0.95    1.00
```

**Phase Details:**
1. **0.00 - 0.15**: Foundation appears, plinth visible
2. **0.15 - 0.55**: Floors rise sequentially from below
3. **0.55 - 0.85**: Glass facade panels slide/fade in
4. **0.85 - 0.95**: Roof scales into place
5. **0.95 - 1.00**: Hold complete building briefly
6. **Reset**: Loop restarts

---

## Component Structure

```text
ConstructionBuilding3D (Container with Canvas)
└── SceneBuilding (Main group with orbit animation)
    ├── Ground Plinth (concrete base)
    ├── BuildingCore
    │   ├── Dark Core Column (center shaft)
    │   ├── Floor Slabs × 7 (animated rise)
    │   ├── Glass Panels × 14 (animated fade-in)
    │   └── Roof Mesh (animated scale)
    ├── Crane (orange tower crane with animated hook)
    └── PerimeterRails (orange safety rails)
```

---

## Materials Definition

| Material | Color | Properties |
|----------|-------|------------|
| Concrete | `#e9eaec` | Rough, matte |
| Dark Core | `#2b2f36` | Slight metalness |
| Glass | `#cfe9ff` | Transmission, clearcoat, transparent |
| Orange | `#ff7a18` | Emissive glow, metallic |
| Steel | `#b9c0c8` | High metalness |

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/three/ConstructionBuilding.tsx` | **Replace** | New procedural building with phased construction animation |
| `src/components/floors/HeroFloor.tsx` | **Update** | Increase container height to 420px for better model visibility |

---

## Technical Implementation Details

### Canvas Configuration
- Device pixel ratio: `[1, 2]` for crisp rendering
- Camera position: `[3.2, 2.2, 5.2]` with 40° FOV
- Shadows enabled with 2048×2048 shadow maps
- Alpha/transparent background for white hero

### Lighting Setup
- Ambient light at 0.55 intensity
- Main directional light from `[6, 8, 4]` with shadows
- Fill directional light from `[-6, 4, -4]`
- Environment preset: "city" for realistic reflections

### Animation System
- Uses `useFrame` hook for per-frame updates
- Shared progress value via `group.userData.progress`
- Smooth easing with cubic smoothstep function
- Crane hook has independent swing/bob animation

### Orange Construction Accents
- Crane tower and boom: Orange with emissive glow
- Crane hook: Orange with glow effect
- Perimeter safety rails: Orange
- All use consistent `#ff7a18` with `emissive: #ff5a00`

---

## Hero Floor Updates

Current height: `h-[320px] sm:h-[380px]`
New height: `h-[380px] sm:h-[420px]`

This gives the 3D model more vertical space for the construction animation to be fully visible, including the crane.

---

## Visual Result

```text
┌─────────────────────────────────────────────────┐
│                  WHITE BACKGROUND               │
│                                                 │
│              ┌─────────────────┐               │
│         🏗️   │  ▓▓▓▓▓▓▓▓▓▓▓▓  │   (Crane)    │
│         │    │  ░░░░░░░░░░░░  │  ← Glass     │
│         │    │  ▓▓▓▓▓▓▓▓▓▓▓▓  │              │
│         │    │  ░░░░░░░░░░░░  │  ← Floors    │
│         │    │  ▓▓▓▓▓▓▓▓▓▓▓▓  │              │
│         ▼    └─────────────────┘              │
│              ════════════════════ ← Rails     │
│              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ← Foundation │
│              ~~~~~~~~ (soft shadow) ~~~~~~~   │
│                                                 │
│    "Premium Architectural Design &              │
│         Engineering Solutions"                  │
│                                                 │
│    [Explore Services]  [View Projects]          │
└─────────────────────────────────────────────────┘
```

---

## No New Dependencies Required

The project already has:
- `@react-three/fiber`: ^8.18.0 ✓
- `@react-three/drei`: ^9.122.0 ✓
- `three`: ^0.160.1 ✓

