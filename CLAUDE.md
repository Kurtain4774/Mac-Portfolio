# CLAUDE.md — macOS Desktop Portfolio

## Project Overview

A portfolio website that replicates the macOS desktop experience. Users interact with the site like they would a Mac — clicking app icons on a dock and desktop grid to open draggable, resizable windows containing portfolio content. The site should feel like a real OS, not a website pretending to be one.

**Tech Stack:** React + Vite (TypeScript)
**Deployment Target:** GitHub Pages (static SPA)
**Primary Audience:** Recruiters and hiring managers for junior SWE roles

---

## Architecture

### State Management

Use Zustand for global state. Key state slices:

- **WindowManager** — tracks all open windows (id, position, size, z-index, minimized/maximized state)
- **DesktopGrid** — icon positions snapped to grid cells
- **ThemeStore** — light/dark mode, selected wallpaper
- **BootState** — first-visit boot animation progress

### Component Hierarchy

```
<App>
├── <BootAnimation />          (first-visit only)
├── <Desktop>
│   ├── <MenuBar />            (top — Apple logo, app name, clock)
│   ├── <DesktopGrid />        (draggable snapping icons)
│   ├── <Window />             (one per open app — generic container)
│   │   ├── <WindowTitleBar />  (traffic lights, title, drag handle)
│   │   └── <WindowContent />   (app-specific content)
│   └── <Dock />               (bottom taskbar)
└── <MobileView />             (iPhone-style layout for mobile)
```

### Key Libraries

- **zustand** — state management
- **@dnd-kit/core + @dnd-kit/sortable** — drag-and-drop for icons and windows
- **framer-motion** — animations (boot sequence, window open/close, transitions)
- **react-rnd** — resizable + draggable windows (handles resize handles, bounds, position)
- **lucide-react** — icons as fallback/supplement

---

## Core Systems

### 1. Window Management System

Every "app" opens in a `<Window>` component. This is the most critical system.

**Window behavior:**
- Default size: ~65% viewport height and width, centered
- Draggable by title bar (not content area)
- Resizable from edges and corners (min size: 400x300)
- Three traffic light buttons (top-left of title bar):
  - 🔴 **Close** — removes window from open state
  - 🟡 **Minimize** — hides window, shows bounce indicator in dock
  - 🟢 **Maximize** — toggles between default size and ~95% viewport
- Z-index management: clicking a window brings it to front
- Multiple windows can be open simultaneously
- Windows cannot be dragged outside viewport bounds

**Window open/close animations:**
- Open: scale from 0.8 → 1.0 with slight fade-in (200ms ease-out)
- Close: scale from 1.0 → 0.8 with fade-out (150ms ease-in)
- Minimize: genie effect toward dock icon position (or simplified scale-down toward dock)

### 2. Desktop Grid System

- Grid cells sized ~90x90px with ~20px gap (like macOS)
- Icons snap to nearest available grid cell on drop
- Icons display: app icon (SVG/image) + label text below
- Double-click or single-click to open (single-click preferred for portfolio — lower friction)
- Icons are freely rearrangeable via drag-and-drop
- Default layout: icons arranged in top-right area of screen (macOS convention)
- Grid persists layout in localStorage between visits

### 3. Dock (Bottom Taskbar)

- Fixed at bottom center of screen
- Contains icons for all apps (same icons as desktop)
- Magnification effect on hover (icons scale up as cursor approaches, like real macOS dock)
- Dot indicator below icon when app window is open
- Bounce animation when minimized window needs attention
- Clicking dock icon: opens app if closed, focuses if open, un-minimizes if minimized
- Subtle glass/blur background effect (backdrop-filter)

### 4. Menu Bar (Top Bar)

- Fixed at top of screen
- Left side: Apple logo (or custom portfolio logo), active app name in bold
- Right side: theme toggle icon, clock showing real time
- Subtle glass/blur background matching dock
- Updates active app name based on which window is focused

### 5. Boot Animation (First Visit Only)

Plays once on first visit. Store completion flag in localStorage.

**Sequence:**
1. Black screen → Apple logo (or custom logo) fade in (1s)
2. Progress bar fills beneath logo (2s)
3. Logo and progress bar fade out (0.5s)
4. Desktop fades in with icons appearing in staggered sequence (0.5s)

Total: ~4 seconds. Skippable by clicking anywhere.

### 6. Dynamic Wallpaper

Wallpaper changes based on user's local time of day:
- **Morning (6am–12pm):** Warm gradient — soft gold/amber to light blue
- **Afternoon (12pm–6pm):** Cool gradient — sky blue to soft white
- **Evening (6pm–9pm):** Warm sunset — deep orange to purple
- **Night (9pm–6am):** Dark gradient — navy to deep purple with subtle star particles

Implement as CSS gradients with smooth transitions. The star particles at night can be a lightweight canvas or CSS animation (small, sparse, slowly drifting dots).

Settings wallpaper picker allows manual override with additional preset options.

---

## App Sections

### App Icon Specifications

Each app needs a custom icon. Design these as SVG components with macOS-style rounded-rectangle containers (squircle shape, ~120x120px canvas with content inset).

| App | Icon Concept | Dock Position |
|-----|-------------|---------------|
| **About** | Silhouette/person icon in blue gradient (like macOS Contacts) | 1 |
| **Experience** | Briefcase icon in warm brown/tan (like macOS work aesthetic) | 2 |
| **Projects** | Code brackets `</>` icon in green/teal gradient | 3 |
| **Contact** | Envelope/mail icon in blue (like macOS Mail) | 4 |
| **Resume** | Document/page icon in red-orange (like macOS Preview/PDF) | 5 |
| **Settings** | Gear icon in gray gradient (like macOS System Preferences) | 6 |

All icons should have the macOS squircle mask shape with a subtle inner shadow and slight 3D depth.

---

### About App

The "homepage" of the portfolio. First thing most visitors will open.

**Content layout (clean white card style):**
- Profile photo/avatar (top, circular or rounded)
- Name (large heading) + title ("Software Engineer" / "CS Graduate")
- Short 2-3 sentence bio
- Quick stats row: school, location, focus areas
- Tech stack grid: small icon badges for languages/frameworks
- Cross-nav links: "View my Projects →", "See my Experience →", "Download Resume →"
  - These links open the respective app windows when clicked

**Resume integration:** Prominent "Download Resume" button that triggers PDF download.

### Experience App

**Content layout:**
- Vertical timeline or stacked cards (most recent first)
- Each entry: role title, company, date range, bullet points
- Education section at bottom (Colorado School of Mines, CS degree)
- Cross-nav: "See what I've built →" linking to Projects

### Projects App

**Content layout:**
- Grid of project cards (2 columns on default window, 3 on maximized)
- Each card:
  - Project thumbnail/screenshot
  - Project name
  - Short description (1-2 lines)
  - Tech stack badges
  - Links: Live Demo | GitHub
- Cards have subtle hover lift/shadow effect
- Cross-nav possible from individual project cards

**Projects to feature:**
1. **SoundSage (Sonata)** — Spotify-integrated mood-based music discovery app (React, Gemini API, MongoDB, Spotify API)
2. **TFT Dualytics** — TFT Double Up stat tracker (React, Riot Games API, Express)
3. **Quoted** — Pinterest-style quote platform (React, Node.js, Express, MongoDB)
4. **HabitFlow** — Habit tracking application

### Contact App

**Content layout:**
- Clean centered layout
- Contact form (name, email, message) — use Formspree or EmailJS for static hosting
- OR simple list of contact methods:
  - Email (mailto link)
  - LinkedIn (external link)
  - GitHub (external link)
- Subtle call-to-action heading ("Let's connect" or similar)

### Resume App

**Content layout:**
- Embedded PDF viewer showing resume (use react-pdf or iframe)
- Download button (prominent, top-right)
- Opens as its own window so recruiters can view alongside other sections

### Settings App

**Content layout (two sections):**

**Theme Toggle:**
- Light / Dark mode switch
- Dark mode should: darken menu bar + dock, keep window content mostly white (cards get very subtle dark treatment), adjust wallpaper brightness

**Wallpaper Picker:**
- Grid of wallpaper thumbnails
- Options: Dynamic (time-based, default), plus 3-4 static presets
- Preset ideas: macOS Sequoia-style, abstract dark gradient, minimal light gradient, custom illustrated option
- Clicking a preset immediately updates the desktop wallpaper
- "Dynamic" option clearly labeled as default

---

## Mobile Experience (iPhone View)

When viewport width < 768px, switch entirely to an iPhone-inspired layout.

**Layout:**
- Status bar at top (time, battery icon — decorative)
- App icon grid (4 columns, matching iOS spacing and squircle icons)
- Tapping an icon navigates to a full-screen page for that section
- Back button / swipe to return to home screen
- Same icons as desktop version
- No dock needed (icons are the primary nav)
- Same boot animation but shorter (2s)

**Important:** This is NOT a responsive macOS layout. It's a completely separate visual mode that feels like an iPhone home screen. The metaphor shifts from macOS → iOS.

---

## Styling Guidelines

### General
- **Font:** Use SF Pro Display (or fallback to -apple-system, system-ui) for the macOS feel in chrome elements (menu bar, dock labels, window title bars). Use a clean sans-serif like DM Sans or Satoshi for window content.
- **Border radius:** Window corners: 12px. Cards inside: 8px. Icons: macOS squircle (use SVG clip-path).
- **Shadows:** Windows get a multi-layer shadow for depth: `0 4px 12px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.12)`
- **Glass effects:** Menu bar and dock use `backdrop-filter: blur(20px)` with semi-transparent background.

### Window Content (White Card Style)
- Background: `#FFFFFF` (light) / `#1E1E1E` (dark)
- Content padding: 32px
- Section headings: 20px semibold
- Body text: 15px regular, `#333` (light) / `#E0E0E0` (dark)
- Cards within windows: subtle border `1px solid rgba(0,0,0,0.06)` with `border-radius: 8px`
- No macOS system preference styling inside windows — keep it modern web/SaaS

### Transitions & Motion
- All transitions: ease-out curves, 150-250ms duration
- Window focus: subtle shadow increase on active window
- Icon hover on desktop: slight scale 1.05
- Dock magnification: smooth CSS transform scaling based on cursor distance
- Page transitions in mobile: slide left/right (iOS-style)

---

## Cross-Navigation System

Certain content within app windows can link to other apps:
- Clicking a cross-nav link (e.g., "View my Projects →" in About) should:
  1. Open the target app window if not already open
  2. Bring it to focus (highest z-index)
  3. Optionally close or minimize the source window (minimize preferred)
- Implement as a shared `openApp(appId)` action in Zustand

---

## Onboarding (First-Time Visitors)

After boot animation completes:
1. A small tooltip appears near the dock or center-bottom: **"Click any app to explore"**
2. Tooltip fades out after 3 seconds
3. All desktop icons have visible text labels beneath them (always, not just on hover)
4. Dock icons also have labels on hover

Store onboarding-shown flag in localStorage so it only appears once.

---

## Build Order (Phased)

### Phase 1 — Foundation
- [ ] Vite + React + TypeScript project setup
- [ ] Zustand store scaffolding (WindowManager, ThemeStore, DesktopGrid)
- [ ] Basic desktop layout: menu bar, desktop area, dock (static, no interactions)
- [ ] Static wallpaper (single gradient)

### Phase 2 — Window System
- [ ] `<Window>` component with react-rnd (drag, resize)
- [ ] Traffic light buttons (close, minimize, maximize)
- [ ] Z-index focus management
- [ ] Window open/close animations with framer-motion
- [ ] Multiple simultaneous windows

### Phase 3 — Desktop & Dock Interactions
- [ ] Desktop icon grid with @dnd-kit snap-to-grid
- [ ] Dock with magnification hover effect
- [ ] Click icon → open window connection
- [ ] Dock indicators (open app dots, minimize bounce)
- [ ] Menu bar: active app name + live clock

### Phase 4 — App Content
- [ ] About section content + layout
- [ ] Experience section content + layout
- [ ] Projects section with grid cards
- [ ] Contact section with form or links
- [ ] Resume section with PDF embed + download
- [ ] Settings section with theme toggle + wallpaper picker
- [ ] Cross-navigation links between apps

### Phase 5 — Polish & Advanced Features
- [ ] Dynamic wallpaper (time-based gradients + night stars)
- [ ] Boot animation sequence
- [ ] Onboarding tooltip
- [ ] Dark mode full implementation
- [ ] localStorage persistence (icon positions, theme, wallpaper, boot flag)
- [ ] Smooth transitions and micro-interactions audit

### Phase 6 — Mobile (iPhone View)
- [ ] Viewport detection + MobileView component
- [ ] iPhone-style icon grid layout
- [ ] Full-screen app pages with back navigation
- [ ] Mobile boot animation (shortened)
- [ ] Touch-friendly interactions

### Phase 7 — Deployment & QA
- [ ] GitHub Pages deployment config (vite base path)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Performance audit (lazy load app content, optimize animations)
- [ ] Accessibility pass (keyboard nav for windows, ARIA labels)
- [ ] SEO meta tags + OG image for link previews
- [ ] Favicon (custom macOS-style icon)

---

## File Structure

```
src/
├── components/
│   ├── desktop/
│   │   ├── Desktop.tsx
│   │   ├── DesktopGrid.tsx
│   │   ├── DesktopIcon.tsx
│   │   ├── MenuBar.tsx
│   │   └── Dock.tsx
│   ├── window/
│   │   ├── Window.tsx
│   │   ├── WindowTitleBar.tsx
│   │   └── WindowContent.tsx
│   ├── apps/
│   │   ├── AboutApp.tsx
│   │   ├── ExperienceApp.tsx
│   │   ├── ProjectsApp.tsx
│   │   ├── ContactApp.tsx
│   │   ├── ResumeApp.tsx
│   │   └── SettingsApp.tsx
│   ├── mobile/
│   │   ├── MobileView.tsx
│   │   ├── MobileAppGrid.tsx
│   │   └── MobileAppPage.tsx
│   ├── boot/
│   │   └── BootAnimation.tsx
│   └── shared/
│       ├── AppIcon.tsx          (shared icon component — squircle + SVG)
│       └── CrossNavLink.tsx     (reusable link that opens another app)
├── stores/
│   ├── windowStore.ts
│   ├── themeStore.ts
│   ├── desktopStore.ts
│   └── bootStore.ts
├── hooks/
│   ├── useWindowManager.ts
│   ├── useDockMagnification.ts
│   └── useTimeOfDay.ts
├── assets/
│   ├── icons/                   (SVG app icons)
│   └── wallpapers/              (static wallpaper images if any)
├── styles/
│   ├── variables.css            (CSS custom properties, theme tokens)
│   ├── global.css
│   └── animations.css
├── config/
│   └── apps.ts                  (app registry — id, name, icon, component mapping)
├── App.tsx
└── main.tsx
```

---

## Important Constraints

- **No SSR needed** — this is a fully client-side SPA
- **GitHub Pages compatible** — configure Vite `base` path, use HashRouter or handle 404 redirect
- **Performance** — lazy-load app content components with React.lazy + Suspense
- **Accessibility** — windows should be keyboard navigable, Escape closes focused window, Tab cycles through dock icons
- **localStorage keys** — prefix all with `portfolio-` to avoid collisions (e.g., `portfolio-theme`, `portfolio-wallpaper`, `portfolio-iconPositions`, `portfolio-bootComplete`)