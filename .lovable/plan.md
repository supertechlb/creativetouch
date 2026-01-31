
# Integrated Scrollytelling with Page Sections

## What You'll Get
Each floor of the building becomes a **full section of the website**, with the interior room image as the background and the actual content (Hero, Services, Studio, Contact) overlaid on top. You'll scroll through floors AND navigate through the site simultaneously.

## Visual Experience

```text
+----------------------------------------------------------+
|  ████████ ROOFTOP TERRACE BACKGROUND ████████████████████ |
|  ████████████████████████████████████████████████████████ |
|                                                          |
|              "Building the Future"                       |
|              [Hero content, CTAs, Stats]                 |
|              [Begin Tour button]                         |
|                                                          |
|                     [Floor 7]                            |
+----------------------------------------------------------+
         ↓ SCROLL DOWN ↓
+----------------------------------------------------------+
|  ████████ PENTHOUSE LIVING BACKGROUND ███████████████████ |
|  ████████████████████████████████████████████████████████ |
|                                                          |
|              "Our Services"                              |
|              [Design | Engineering | Construction]       |
|              [Service cards with icons]                  |
|                                                          |
|                     [Floor 6]                            |
+----------------------------------------------------------+
         ↓ SCROLL DOWN ↓
+----------------------------------------------------------+
|  ████████ CREATIVE OFFICE BACKGROUND ████████████████████ |
|  ████████████████████████████████████████████████████████ |
|                                                          |
|              "The Studio"                                |
|              [Portfolio grid]                            |
|              [Project filter tabs]                       |
|                                                          |
|                     [Floor 5]                            |
+----------------------------------------------------------+
         ↓ SCROLL DOWN ↓
+----------------------------------------------------------+
|  ████████ GRAND LOBBY BACKGROUND ████████████████████████ |
|  ████████████████████████████████████████████████████████ |
|                                                          |
|              "Get In Touch"                              |
|              [Contact form]                              |
|              [Contact info cards]                        |
|                                                          |
|                     [Floor 1]                            |
+----------------------------------------------------------+
```

## Floor-to-Section Mapping

| Floor | Background Image | Section Content |
|-------|-----------------|-----------------|
| 4 | Rooftop Terrace | **Hero** - Welcome, headline, CTAs, stats |
| 3 | Penthouse Living | **Services** - Design, Engineering, Construction |
| 2 | Creative Office | **Studio** - Portfolio gallery with filters |
| 1 | Grand Lobby | **Contact** - Quote form, contact info |

## How It Works
1. **Single Scrollytelling Container**: One main component handles everything
2. **Fullscreen Backgrounds**: Each section has its interior image as the fixed background
3. **Content Overlays**: Hero, Services, Studio, Contact content displayed on top
4. **Glass/Semi-transparent Cards**: Section content uses glass-morphism or semi-transparent backgrounds for readability
5. **Smooth Transitions**: Background crossfades between floors while content scrolls

---

## Technical Implementation

### Architecture Change
Consolidate everything into `BuildingInterior.tsx`:
- Remove separate HeroSection, ServicesSection, StudioSection, ContactSection from Index
- Embed their content directly inside the scrollytelling floors
- Each floor gets both a background image AND the section content

### Files to Modify

**`src/components/BuildingInterior.tsx`** (Major Rewrite)
- Reduce to 4 floors (matching the 4 main sections)
- Each floor includes:
  - Fullscreen background image with overlay for readability
  - The actual section content (Hero/Services/Studio/Contact)
- Content styled with glass-morphism containers
- Preserve all existing section functionality (portfolio filters, contact form, etc.)

**`src/pages/Index.tsx`** (Simplify)
- Remove HeroSection, ServicesSection, StudioSection, ContactSection imports
- Just render: Navbar + BuildingInterior + Footer

### Files That Stay Unchanged
- `src/components/Navbar.tsx` - Keep fixed navigation
- `src/components/Footer.tsx` - Keep at the end
- `src/components/FloorIndicator.tsx` - Keep elevator indicator
- `src/components/StudioSection.tsx` - Will extract its logic into BuildingInterior
- `src/components/ContactSection.tsx` - Will extract its logic into BuildingInterior

### Key Implementation Details

**Glass-morphism Containers for Readability:**
```css
.content-overlay {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 48px;
}
```

**Scroll Height Calculation:**
- Each floor = 100vh minimum (some floors may need more for content)
- Services floor might need 120vh for the cards
- Studio floor needs 150vh for the portfolio grid
- Contact floor = 100vh

**Content Animation:**
- Content fades in as you enter each floor
- Uses `whileInView` from Framer Motion
- Staggered animations for child elements

### Section Content Summary

**Floor 4 - Hero:**
- Badge, headline, description
- CTA buttons (Begin Tour, View Our Work)
- Stats row (150+ Projects, 80+ Clients, 15+ Years)
- Scroll indicator

**Floor 3 - Services:**
- Section header with badge
- 3 service cards (Design, Engineering, Construction)
- Each card: icon, title, description, feature list
- "Explore All Services" CTA

**Floor 2 - Studio:**
- Section header
- Category filter tabs
- 6-project masonry grid
- Project modal with details

**Floor 1 - Contact:**
- Two-column layout
- Left: Headline, description, contact info cards
- Right: Quote form with inputs
