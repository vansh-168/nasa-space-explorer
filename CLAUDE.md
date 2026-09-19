# CLAUDE.md - AI & Developer Guidelines

## Project Overview

**Project Name:** NASA "Picture of the Day" Space Explorer  

**Objective:** A React application that fetches high-resolution space imagery using NASA's Astronomy Picture of the Day (APOD) Open API. Features include date pickers, bookmarking/favorites functionality, and smooth modal overlays for explanations.


---
## Project Structure
```text
nasa-space-explorer/
├── .gitignore
├── .oxlintrc.json
├── CLAUDE.md
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx        # entry point, mounts <App/>
    ├── App.jsx         # Main application container / component tree
    ├── App.css
    ├── index.css
    └── assets/
        ├── hero.png
        ├── react.svg
        └── vite.svg
```
    
## Technical Stack
- **Framework:** [e.g., React, Next.js, Node.js, Python]
- **State/Data:** [e.g., Redux, Zustand, React Query, Prisma]
- **Styling:** [e.g., Tailwind CSS, CSS Modules, Styled Components]
- **Testing:** [e.g., Jest, Vitest, Cypress, Playwright]

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