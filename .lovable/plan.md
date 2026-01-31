
# Immersive Building Interior Scrollytelling

## Overview
Replace the external 3D building model with a **full-screen immersive scroll experience** where users feel like they're inside a building, descending floor-by-floor as they scroll. Each floor reveals different rooms with interior design images and decorations.

## Visual Concept
```text
+----------------------------------------------------------+
|  ROOF/STARTING POINT - Welcome Message                   |
|  ========================================================|
|                                                          |
|  FLOOR 5: Penthouse Suite                                |
|  ┌─────────────────────────────────────────────────────┐ |
|  │  [Living Room Image]    [Terrace Image]             │ |
|  │       "Luxury Living"                               │ |
|  └─────────────────────────────────────────────────────┘ |
|                                                          |
|  ──────── FLOOR DIVIDER (architectural element) ──────── |
|                                                          |
|  FLOOR 4: Creative Studio                                |
|  ┌─────────────────────────────────────────────────────┐ |
|  │  [Office Image]    [Meeting Room Image]             │ |
|  │       "Where Ideas Come to Life"                    │ |
|  └─────────────────────────────────────────────────────┘ |
|                                                          |
|  ... continues for each floor ...                        |
|                                                          |
|  FLOOR 1: Ground Floor / Lobby                           |
|  ┌─────────────────────────────────────────────────────┐ |
|  │  [Reception Image]    [Entrance Image]              │ |
|  │       "Welcome to Creative Touch"                   │ |
|  └─────────────────────────────────────────────────────┘ |
+----------------------------------------------------------+
```

## Implementation Plan

### 1. Remove 3D Components
- Delete `Building3D.tsx` (the external 3D skyscraper)
- Delete `HeroScene.tsx` (the Three.js canvas wrapper)
- Keep Three.js dependencies for the Studio walkthrough feature

### 2. Create New Building Interior Component
**New file: `src/components/BuildingInterior.tsx`**

This will be a full-screen scrollytelling component featuring:
- **Architectural frame elements**: Decorative pillars, floor dividers, elevator shaft visual on the side
- **Floor sections**: Each floor is a full viewport height (100vh) with room images
- **Parallax effects**: Images move at different speeds for depth
- **Floor indicator**: A fixed indicator showing current floor (like an elevator display)
- **Scroll-triggered animations**: Rooms fade/slide in as you scroll to them

### 3. Define Floor/Room Data Structure
```typescript
interface Room {
  name: string;
  image: string;
  description: string;
}

interface Floor {
  number: number;
  name: string;
  tagline: string;
  rooms: Room[];
  accentColor: 'primary' | 'secondary' | 'accent';
}
```

**5 Floors with different themes:**
1. **Penthouse**: Luxury residential showcase
2. **Creative Studio**: Open workspace design
3. **Living Spaces**: Modern apartments
4. **Commercial**: Office/retail design
5. **Lobby**: Grand entrance, reception

### 4. Redesign HeroSection
**Modify: `src/components/HeroSection.tsx`**

- Remove the 3D canvas and `HeroScene` import
- Make the hero a simple welcome intro that transitions into the building
- Add a "Begin Tour" CTA that smooth-scrolls into the building interior
- Keep the stats and branding elements

### 5. Visual Effects & Animations
- **Floor transitions**: Smooth crossfade with vertical slide
- **Room reveals**: Staggered entrance animations using Framer Motion
- **Parallax layers**: Background architectural elements move slower than content
- **Floor dividers**: Decorative horizontal elements with the brand colors (orange/blue gradients)
- **Ambient details**: Subtle floating particles or light rays for atmosphere

### 6. Floor Indicator Component
**New file: `src/components/FloorIndicator.tsx`**

A fixed sidebar/corner element showing:
- Current floor number (large display)
- Floor name
- Progress dots or mini elevator visualization
- Styled like a building directory

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/BuildingInterior.tsx` | Main scrollytelling container with all floors |
| `src/components/FloorSection.tsx` | Individual floor layout with rooms |
| `src/components/FloorIndicator.tsx` | Fixed elevator-style floor display |
| `src/components/RoomCard.tsx` | Image card for each room with hover effects |

### Files to Modify
| File | Changes |
|------|---------|
| `src/components/HeroSection.tsx` | Remove 3D scene, simplify to intro + CTA |
| `src/pages/Index.tsx` | Add `BuildingInterior` between Hero and Services |

### Files to Delete
| File | Reason |
|------|--------|
| `src/components/Building3D.tsx` | Replaced by interior experience |
| `src/components/HeroScene.tsx` | No longer needed |

### Room Images
Will use high-quality Unsplash interior design images:
- Living rooms, bedrooms, offices
- Reception areas, meeting rooms
- Kitchens, terraces, creative studios

### Scroll Behavior
- Each floor = `100vh` height
- `useScroll` from Framer Motion tracks position
- Floor transitions use `useTransform` for smooth opacity/position changes
- Snap scrolling optional (can be added later)

## User Experience Flow
1. Land on page → See hero with "Welcome to Creative Touch"
2. Scroll down → Enter the building from the roof
3. Continue scrolling → Descend through each floor
4. Each floor showcases different room types with beautiful interior images
5. Exit building → Continue to Services, Studio, Contact sections

This creates an **immersive, memorable experience** that showcases interior design capabilities while maintaining the clean, premium aesthetic.
