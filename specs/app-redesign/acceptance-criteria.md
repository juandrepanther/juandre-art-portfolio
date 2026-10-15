# Acceptance criteria

## Functional

- [ ] Home opens to an immersive 3D landing experience instead of redirecting to the Maze game.
- [ ] The Maze game remains available at /maze-game and is still playable on desktop and mobile.
- [ ] TanStack Router is used for the app shell, and the route tree contains only Home and /maze-game.
- [ ] The Home page includes a working CV download action for the CV document.
- [ ] The Home page includes clear, working outbound links for all supported contact methods.
- [ ] All CV data is used in the redesigned app with no omitted sections or stray unused content.
- [ ] Dark mode is the default theme and persists across reloads.
- [ ] Redux is removed from runtime state management and replaced with Zustand.
- [ ] The application uses only two routes: Home and /maze-game.
- [ ] Unused code blocks, packages, and files are removed as part of the redesign cleanup.

## Visual

- [ ] The app uses a distinct dark-first visual system with a custom palette and does not look like a default MUI starter.
- [ ] GlassBackground from shaders is used in the Home experience.
- [ ] The Home page feels like a designed interactive installation on desktop and mobile.
- [ ] The Home page contains the full immersive 3D presentation, while the Maze route remains untouched as a separate game experience.
- [ ] CV and contact content feels like part of the same cohesive Home-page identity.

## Performance

- [ ] Heavy 3D experiences are route-split and do not block initial Home rendering.
- [ ] Unsupported shader or WebGPU environments receive a graceful fallback instead of a broken view.
- [ ] The application passes its production build and code-health checks.

## Accessibility

- [ ] Interactive elements have visible keyboard focus and sensible tab order.
- [ ] Contrast remains readable in both light and dark modes.
- [ ] Reduced-motion preferences lower or disable non-essential scene motion.
- [ ] Maze onboarding and mobile controls are understandable without hover.

## Verification

- [ ] Manual check: Home and Maze routes work directly from a fresh load.
- [ ] Automated test check: `pnpm test` passes with Vitest.
- [ ] Render coverage check: automated tests verify the Home hero, Maze entry CTA, CV download link, core content sections, and the Maze WebGL fallback state.
- [ ] Build succeeds: the app builds successfully and is considered working, tested, and running with no errors.
- [ ] Lint succeeds: project lint and type-check gates pass.
- [ ] Code review check: the implementation reuses components where sensible, stays minimal, and remains easy to maintain.
- [ ] Final review check: the code is reviewed after implementation and all inconsistencies are fixed before sign-off.
- [ ] Style parity check: naming, syntax, and styling match the reference project conventions.
