# Birthday Babe — Module 01

React + Tailwind CSS + Vite. Local development module, not a published site.

## Run

Use Node.js 22.12+ or a compatible supported newer release.

```bash
npm install
npm run dev
```

```bash
npm run build
```

The included lockfile records the versions used for the build check. Use `npm ci` to install those exact versions.

## Scope

Welcome page with the original generated envelope artwork, self-hosted fonts, responsive layout, image skeleton/retry, working chime toggle and an accessible letter dialog. Clicking the envelope, main button or Next opens the letter. Escape or Close dismisses it. Mobile can scroll naturally on short screens.

The six chapter indicators establish the planned flow; this module implements only Welcome. Memories, reasons, voice letter, future and birthday finale will be implemented in later modules. The welcome letter is a complete first-module interaction, not a fake memories route.

The chimes are locally synthesized, not a personal recording. They start only after the user taps the toggle.

## Artwork

`public/images/welcome-reference.png` is the ORIGINAL first design board. CSS displays only its envelope region without modifying its pixels. All surrounding page text and controls are real HTML. Keep this filename unchanged. A generated mockup does not specify exact font metrics; browser typography and responsive layouts can differ slightly. This is a faithful implementation, not a verified pixel-identical match.

## Files

- `src/App.jsx` — Welcome page, sound and letter interaction
- `src/index.css` — design tokens, artwork viewport, responsive styles
- `src/main.jsx` — local font imports and React entry point
- `vite.config.js` — React and Tailwind Vite plugins

No account, backend, environment variables, tracking or uploaded personal media is required for Module 01.
