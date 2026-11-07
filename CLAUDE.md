# CLAUDE.md - AI & Developer Guidelines

## Project Overview

**Project Name:** NASA "Picture of the Day" Space Explorer  

**Objective:** A React application for browsing NASA's Astronomy Picture of the Day (APOD): daily picture with explanation, date navigation (buttons, picker, ← → keys), random picture, recent-pictures gallery, saved favorites, and shareable `?date=` links.

**Data source (important):** `https://science.nasa.gov/wp-json/wp/v2/apod-basic` — `/<YYMMDD>` for one day, `?per_page=&page=` for newest-first lists (max 25 per page, `X-WP-Total` header = archive size). No API key; CORS allowed. Do NOT switch back to `api.nasa.gov/planetary/apod`: since APOD moved to science.nasa.gov it returns a "NASA Science" logo placeholder for every date. Feed HTML (explanation, credit) must go through `src/utils/sanitizeHtml.js` before rendering.

**Dates:** APOD's "today" is US Eastern time (`todayIso()`); date math must stay in UTC (`addDays()`), otherwise timezones ahead of UTC (e.g. India) skip days.


---
## Project Structure
```text
nasa-space-explorer/
├── index.html              # title, meta/OG tags, fonts
├── public/favicon.svg
└── src/
    ├── main.jsx            # entry point, mounts <App/>
    ├── App.jsx             # state, URL sync, keyboard shortcuts, share, random
    ├── App.css             # component styles (dark theme)
    ├── index.css           # design tokens, starfield background, base styles
    ├── api/apod.js         # science.nasa.gov feed: getApod, getLatest, getRecent, getRandom, resizeImage
    ├── hooks/
    │   ├── useApod.js      # one day (null = latest), derived loading state
    │   ├── useGallery.js   # paged recent pictures
    │   └── useFavorites.js # localStorage favorites (+ upgrades old saved format)
    ├── utils/
    │   ├── date.js         # todayIso (US Eastern), addDays (UTC), formatters
    │   └── sanitizeHtml.js # allow-list sanitizer for feed HTML
    └── components/         # Header, DateControls, ApodViewer, ApodMedia, ViewerSkeleton,
                            # Gallery, FavoritesPanel, ErrorMessage, Footer
```

## Technical Stack
- **Framework:** React 19 + Vite
- **State/Data:** React hooks only (no state library); in-memory cache in `api/apod.js`
- **Styling:** Plain CSS with custom properties (Instrument Serif + Inter)
- **Testing:** none yet — verify in the browser (including a non-US timezone)

---

## Commands

### Development
- `npm run dev` — Start the local development server
- `npm run build` — Build the application for production
- `npm run preview` — Preview the production build locally

### Quality & Linting
- `npm run lint` — Run static code analysis and linting checks
- `npm run format` — Format codebase using Prettier / Formatter
- `npm run test` — Execute unit and integration tests

---

## Code Style & Conventions

1. **Architecture & File Organization:**
   - Keep components modular, single-responsibility, and easy to test.
   - Group related files together by feature or functional domain.
   - Maintain clear separation between UI layout, state management, and API logic.

2. **TypeScript & React Standards (if applicable):**
   - Favor functional components with explicit TypeScript interfaces/types for props.
   - Avoid `any` types; prefer strict type checking where possible.
   - Use descriptive variable names and standard React hooks (`useState`, `useEffect`, `useCallback`).

3. **Error Handling & Asynchronous Code:**
   - Always wrap async API calls in `try/catch` blocks or explicit error boundaries.
   - Provide clear user-facing loading and error states for all network operations.
   - Use environment variables (`process.env` or `import.meta.env`) for secrets and external endpoints.

4. **Styling & Accessibility:**
   - Follow mobile-first responsive design practices.
   - Maintain proper semantic HTML structure (`<header>`, `<nav>`, `<main>`, `<article>`) and accessibility (ARIA labels, keyboard navigation).

---

## Git & Workflow Rules
- **Commit Messages:** Follow standard conventional commits format (e.g., `feat: add bookmark filter`, `fix: resolve modal z-index`).
- **PR Scope:** Keep pull requests focused on a single logical change or feature branch.