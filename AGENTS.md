# AGENTS.md

## Project Snapshot

- React 18 + Vite + TypeScript portfolio that mimics a macOS desktop.
- Static SPA intended for GitHub Pages; `vite.config.ts` currently uses `base: '/Gavin-Portfolio/'`.
- Desktop mode is active at `>= 768px`; mobile mode switches to a separate iPhone-style UI.
- Portfolio data is centralized in `src/config/content.ts`; app registration lives in `src/config/apps.ts`.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Production build/typecheck: `npm run build`
- Preview built output: `npm run preview`
- Deploy to GitHub Pages: `npm run deploy`

There is no lint script or test suite configured. Use `npm run build` as the main verification command.

## Important Paths

- `src/App.tsx` - top-level desktop/mobile switch and theme attribute setup.
- `src/types/index.ts` - shared `AppId`, window, icon, wallpaper, and time-of-day types.
- `src/config/apps.ts` - dock/desktop app list, icons, lazy-loaded app components, mail app behavior.
- `src/config/content.ts` - profile, tech stack, experience, projects, and contact data.
- `src/config/menus.tsx` - menu bar menu definitions.
- `src/stores/` - Zustand stores for windows, desktop icons, theme, boot, trash, drag, and system UI.
- `src/components/window/` - generic draggable/resizable window shell and app content loader.
- `src/components/desktop/` - desktop grid, dock, menu bar, trash, and desktop composition.
- `src/components/menubar/` - Apple menu, control center, clock, spotlight, Siri, Wi-Fi, battery UI.
- `src/components/apps/` - app window contents such as About, Work, Contact, Resume, Settings.
- `src/components/mobile/` - mobile-only home screen and full-screen app pages.
- `src/styles/variables.css` - theme tokens, shadows, radii, fonts.
- `src/styles/global.css` - reset, document sizing, window base styles.
- `src/styles/animations.css` - shared keyframes.
- `src/assets/icons/` and `src/assets/wallpapers/` - bundled visual assets.
- `public/resume.pdf`, `public/favicon.svg`, `public/404.html` - static public assets.

## Architecture Notes

- Windows are global state in `useWindowStore`; opening an already-open app focuses or unminimizes it.
- `mail` is a special app: it has `mailto` in `apps.ts` and does not render a window component.
- Desktop icon positions and renamed labels persist via `zustand/middleware` under `portfolio-iconPositions`.
- Boot completion persists in localStorage; theme state also persists through its store.
- App content is lazy loaded through `WindowContent`, so new windowed apps need an `AppId`, an `apps.ts` entry, and a component default export.
- Desktop and mobile experiences are intentionally different; do not try to make desktop windows responsive for mobile.
- `react-rnd` handles windows; `@dnd-kit` handles desktop icon dragging/sorting.

## Editing Guidelines

- Prefer updating `src/config/content.ts` for portfolio copy instead of hardcoding text inside components.
- When adding an app, update `AppId`, `apps.ts`, likely `DesktopStore` default icon IDs, and mobile rendering if it should appear on mobile.
- Keep the macOS illusion intact: glass menu/dock, traffic-light window controls, app icons, draggable desktop icons, and window focus behavior.
- Use CSS variables in `variables.css` for repeated color/shadow/radius decisions.
- Keep cards at 8px radius and windows at 12px unless matching an existing local pattern.
- Avoid broad refactors; many components use inline styles for precise OS-like layout.
- Preserve existing localStorage keys unless intentionally writing a migration.
- Treat `CLAUDE.md` as older long-form product direction; this file is the concise operational guide.
- Some older text shows mojibake characters from encoding issues. Prefer plain ASCII unless you intentionally clean encoding in a touched file.

## UI/UX Expectations

- Desktop should feel like an operating system, not a landing page.
- Recruiters should quickly find About, Work/Projects, Resume, and Contact.
- Keep interactions discoverable: dock icons need labels/tooltips, windows need clear controls, mobile pages need obvious back navigation.
- Maintain keyboard basics where already present, especially click targets with `role="button"` and `tabIndex`.
- Do not add visible instructional copy for obvious controls; use familiar OS metaphors.

## Verification

- Run `npm run build` after code changes.
- For visual/UI changes, start `npm run dev` and check both desktop and mobile widths.
- Verify app open/focus/minimize/close behavior when touching windows, dock, app registration, or stores.
- Verify desktop icon drag/drop and localStorage persistence when touching `DesktopGrid`, `DesktopIcon`, or `desktopStore`.
- Verify resume paths and GitHub Pages base paths when touching public assets or deployment config.
