# Requirements

## In scope

- Maze game: preserve the /maze-game route, keep the game playable on desktop and mobile, and modernize its implementation without removing the experience.
- Navigation: use only two app routes, Home and /maze-game, with no separate CV or contact routes.
- Routing architecture: use TanStack Router as the app router, with a code-based route tree for Home and /maze-game.
- Visual redesign: rebuild the UI with latest MUI, a custom dark-first palette, shader-driven glass surfaces, and an immersive 3D Home route that contains all the 3D presentation work.
- Content changes: keep the CV document downloadable and keep contacts easy to discover directly on the Home page.
- Testing: add Vitest-based render tests that verify critical Home-page content and route-level fallbacks render correctly.
- Cleanup: remove all unused code blocks, unused packages, and unused files that are no longer needed after the redesign.
- Accessibility: support keyboard navigation, visible focus states, reduced motion, and readable contrast in both light and dark modes.
- Performance: split route bundles, lazy-load heavy 3D features, keep initial Home paint responsive, and provide graceful fallbacks when WebGPU effects are unavailable.

## Out of scope

- What should not be changed in this phase? The user-facing purpose of the app, the Maze route URL, the downloadable CV asset, and the existing Vercel deployment strategy.
- What implementation shortcuts are acceptable? Static or CSS-based fallbacks for unsupported shader/WebGPU environments, provided they preserve layout and navigation.

## Constraints

- Browser/device constraints: the app must work on modern desktop and mobile browsers, degrade gracefully without WebGPU, and remain responsive at common phone and laptop widths.
- Content constraints: CV content must stay accurate and downloadable inside the Home page; all CV data must be used; contact actions must remain direct external links inside the Home page; the Maze game must remain reachable from its own route.
- Technical constraints: use pnpm, latest stable React/TypeScript/Vite/MUI/TanStack Router/Vitest-compatible tooling, remove Redux in favor of Zustand, and keep the existing Vercel SPA rewrite setup.
- Maintainability constraints: think like a senior developer, reuse existing components wherever possible, prefer the smallest readable implementation, and keep the codebase easy to understand and maintain.
- Review constraints: after implementation, review the code for inconsistencies and fix any issues before the redesign is considered complete.
- Code-style constraints: follow the reference project's naming patterns, syntax, and styling conventions so the resulting code reads the same way across the app.
- Verification constraints: keep a working `pnpm test` flow with Vitest, include jsdom-based render coverage for the Home route, and cover at least one graceful fallback path for the Maze route.
- Shaders tooling constraints: install and use the Shaders agent skill for component layering and CLI workflow, configure the Shaders MCP server for AI-assisted design editing, and use shaders.com/llms.txt plus shaders.com/llms-full.txt as the reference docs for component props, defaults, and ranges.

## Open questions

- Question 1: should the Home page offer PDF-only CV download, or PDF plus an in-browser print view?
- Question 2: should the Home page 3D scene use a fully custom R3F composition only, or mix custom geometry with imported assets where that improves quality?
- Question 3: should the Maze route keep its current gameplay rules exactly, or can onboarding/control hints be modernized as long as the maze itself stays intact?
