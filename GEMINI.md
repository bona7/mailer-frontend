You are the best developer in the world. 
Think in English, but always answer in Korean

# GEMINI.md — Mailer Frontend Ground Rules

> **Stack**: React + Vite + Tailwind CSS + + React Router + React Query (TanStack) + Axios
>
> **Goal**: Any laptop screen → stable, responsive, fluid layout. Clean DX with strict linting/formatting. Default exports only. Figma design fidelity with MCP integration.

---

## 0. Project Structure (source of truth)

```
mailer-frontend/
├── node_modules/
└── src/
    ├── api/              # server comms (REST/RPC). Optionally: api/hooks/
    ├── app/
    │   ├── axios.js      # Axios instance (baseURL, interceptors)
    │   ├── Router.jsx    # App routes
    │   └── queryClient.js# React Query client
    ├── assets/           # images, svgs, icons
    ├── components/
    │   ├── ui/           # ui primitives (locally copied)
    │   └── index.js      # central export barrel (default exports only)
    ├── data/
    │   └── dummy.jsx     # pageName_dummy.jsx
    ├── lib/
    │   └── utils.js      # pure helpers only
    ├── pages/
    │   ├── index.js
    │   ├── MainPage.jsx
    │   ├── Template.jsx
    │   └── TestPage.jsx
    ├── App.css
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

**Rules**

* Create new page under `src/pages/` and route in `app/Router.jsx`.
* UI building blocks go to `components/`. Complex feature components may live near their page.
* **Default export only** for components & pages.
* Assets: prefer SVG for icons/illustrations.

---

## 1. Code Style, Linting, Formatting

### ESLint

* Use React + hooks + import/order rules. No unused vars, no default `any` in TS (if/when added).

### Prettier

* 2 spaces, single quotes, trailing commas where valid, printWidth 100–110.
* Always format on save.

### Naming

* Components: `PascalCase.jsx` (default export).
* Hooks: `useXxx.js`.
* CSS classes: Tailwind utilities only; avoid custom class unless necessary.
* Files and folders are in **English** (lowercase with dashes) except React components.

### Imports

* Third-party → absolute alias → local.
* Group and separate by blank lines.

---

## 2. Tailwind CSS Conventions

### Design Tokens

* Mirror **Figma tokens** in `tailwind.config.js`:

  * `screens`: `sm 640`, `md 960`, `lg 1280`, `xl 1536` (align with Figma breakpoints).
  * Extend `colors.brand`, `spacing`, `fontSize`, `borderRadius` based on Figma MCP tokens.
* Keep tokens as **single source of truth**; do not hardcode hex/px repeatedly.

### Responsive & Fluid Layout

* Prefer `rem`, `%`, and grid `fr` for layout.
* Constrain reading width: `mx-auto max-w-screen-xl/2xl` + `px-4 md:px-6`.
* Use `min-h-dvh` to handle viewport height correctly.
* Typography with `clamp()` for adaptive sizes (when necessary).

### Plugins

* Add `@tailwindcss/container-queries` for component-scoped responsiveness.
* Add `@tailwindcss/typography` for email content preview.

---

## 3. Figma MCP Integration

* **Figma MCP (Measure → Compare → Produce)** workflow is mandatory:

  * **Measure**: Inspect spacing, color, typography directly in Figma.
  * **Compare**: Match against Tailwind config tokens before coding.
  * **Produce**: Implement using Tailwind utilities to ensure fidelity.
* Always validate implementation side-by-side with Figma designs.
* Use Figma design tokens (colors, radii, spacing, typography) as Tailwind config extensions.
* Document mismatches and propose config updates, never override ad hoc in JSX.

---

## 5. Routing (app/Router.jsx)

* React Router v6+. Code-split heavy routes.
* Use layout routes for shell (sidebar + content).

---

## 6. Data Fetching & Caching

* Use **React Query**, not raw `useEffect`.
* Query keys array form. Default stale time 30s.

---

## 7. HTTP (app/axios.js)

* Centralize baseURL, interceptors, error normalization.
* Handle 401 globally.

---

## 8. Accessibility (a11y)

* Keyboard-first, focus-visible states, WCAG AA contrast.

---

## 9. UI Patterns

* Layout shell: sidebar + main content.
* List view: card (mobile), table (desktop).

---

## 10. Performance

* Memoize, virtualize lists, lazy load images.

---

## 11. Environment & Secrets

* VITE_ prefix for env vars.
* No secrets in repo.

---

## 12. Testing

* Unit test non-trivial utils. Smoke test essential flows.

---

## 13. Commits & PRs

* Conventional Commits.
* Small PRs with screenshots/gifs for UI.

---

## 14. Default Export Pattern

* Always default-export components. Re-export in `components/index.js`.

---

## 15. Do & Don’t

**Do**

* Build responsive-first; test at 1024, 1280, 1536 widths.
* Validate against **Figma MCP** before merge.
* Centralize design tokens in Tailwind config.

**Don’t**

* Don’t hardcode values outside token system.
* Don’t ignore Figma variance; log mismatches.

---

## 16. Definition of Done (per feature)

* [ ] Responsive on 1024–1536 widths without layout breaks
* [ ] Matches Figma MCP tokens (spacing, colors, typography)
* [ ] a11y: keyboard nav + focus ring + labels
* [ ] Empty/loading/error states implemented
* [ ] API hooked via React Query, error handled
* [ ] Screenshots + Figma comparison attached to PR

---

**This document is the living contract for Mailer FE. Keep in sync with Figma MCP.**
