# Overview

## Product goal

- The app should immediately communicate that this is a polished personal portfolio for an interactive 3D artist/developer, not a generic brochure site.
- The main journey is: land on the immersive Home experience, explore the CV and contact information on the Home page, and enter the Maze game without friction.
- What should remain recognizable: the portfolio's personal identity, the downloadable CV, the contact section, and the Maze route as a preserved signature experience.

## Experience summary

- Primary experience: a dark-first, immersive Home page with all scroll-driven 3D motion, shader-based glass surfaces, CV download access, contact actions, and short editorial copy consolidated into one route.
- Secondary experience(s): the standalone Maze game route.
- Experiences to remove or fold into the main flow: separate CV and contact routes, the current homepage model presentation, the current Redux-driven app state, and any overlay-heavy or duplicate entry points that compete with the main narrative.

## Design principles

- Principle 1: make the Home page feel like a curated interactive installation, with motion and depth used deliberately rather than constantly.
- Principle 2: keep the CV and contact sections readable, fast, and utility-first inside the Home page, so they behave like serious reference content rather than detours.
- Principle 3: keep the Maze route intact as a distinct playable experience while modernizing its architecture and controls.
