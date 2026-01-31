
# Fullscreen Scrollytelling with Immersive Background Transitions

## What You'll Get
A cinematic scroll experience where each floor is a **fullscreen background image** that transitions smoothly as you scroll. Instead of room cards on a page, the entire screen becomes the room itself - like walking through a building.

## Visual Experience

```text
+--------------------------------------------------+
|                                                  |
|   ████████████ ROOF IMAGE ██████████████████     |
|   ██████████ (Rooftop View) █████████████████    |
|   ████████████████████████████████████████████   |
|   ███████████████████ ███████████████████████    |
|              "Welcome to the Top"                |
|              [Floor 5 Indicator]                 |
+--------------------------------------------------+
         ↓ SCROLL DOWN ↓
+--------------------------------------------------+
|                                                  |
|   ████████ LIVING ROOM IMAGE ████████████████    |
|   ██████████ (Penthouse) ████████████████████    |
|   ████████████████████████████████████████████   |
|              "Luxury Living"                     |
|              [Floor 4 Indicator]                 |
+--------------------------------------------------+
         ↓ SCROLL DOWN ↓
+--------------------------------------------------+
|                                                  |
|   ████████████ KITCHEN IMAGE ████████████████    |
|   ██████████████████████████████████████████     |
|              "Gourmet Space"                     |
|              [Floor 3 Indicator]                 |
+--------------------------------------------------+
```

## How It Works
1. **Sticky Container**: A fullscreen container stays fixed while you scroll
2. **Background Layers**: Multiple full-screen images stacked, each fading in/out based on scroll position
3. **Content Overlays**: Minimal text labels appear on top of each background
4. **Smooth Crossfade**: As you scroll past threshold points, one image fades out while the next fades in

## Floor Sequence (7 Rooms)
| Floor | Room Type | Background Image |
|-------|-----------|------------------|
| 7 | Rooftop Terrace | Luxury rooftop with city views |
| 6 | Penthouse Living | Modern open-concept living room |
| 5 | Kitchen | High-end gourmet kitchen |
| 4 | Master Bedroom | Elegant bedroom suite |
| 3 | Office | Creative workspace/studio |
| 2 | Villa Exterior | Mediterranean villa outdoor |
| 1 | Grand Lobby | Reception hall entrance |

---

## Technical Details

### Architecture Change
Replace the current card-based layout with a **sticky scroll container** where:
- One container is `position: fixed` at `100vh` height
- A scroll spacer creates the scroll height (7 floors x 100vh)
- Scroll progress controls which background is visible

### Files to Modify

**`src/components/BuildingInterior.tsx`** (Complete Rewrite)
- Create a sticky fullscreen container
- Stack 7 background image layers with absolute positioning
- Track scroll progress to control opacity of each layer
- Add minimal text overlay for room names

**`src/components/FloorIndicator.tsx`** (Minor Updates)
- Keep the elevator-style indicator
- Update to work with the new 7-floor structure

### Files to Delete
- `src/components/FloorSection.tsx` - No longer needed (floors are now backgrounds)
- `src/components/RoomCard.tsx` - No longer needed (no cards, just fullscreen images)

### Key Implementation Details

**Scroll-to-Opacity Mapping:**
```typescript
// Each floor occupies ~14% of total scroll (1/7)
// When scroll is 0-14%: Floor 7 visible
// When scroll is 14-28%: Crossfade to Floor 6
// etc.
```

**Fullscreen Background Styling:**
```css
.floor-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}
```

**Text Overlay:**
- Semi-transparent dark gradient at bottom for text readability
- Large floor name + short tagline
- Positioned center or bottom of screen

### Image Selection
Will use stunning Unsplash images for each room:
- Rooftop: Dramatic sky terrace
- Living Room: Bright modern interior
- Kitchen: Marble counters, premium appliances
- Bedroom: Cozy, elegant suite
- Office: Inspiring workspace
- Villa: Mediterranean outdoor beauty
- Lobby: Grand architectural entrance
