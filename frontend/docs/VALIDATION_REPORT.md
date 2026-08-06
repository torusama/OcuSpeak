# Validation Report

Generated on 2026-08-05.

## Passed checks

- Project structure validator: passed.
- Router declarations checked: 39.
- TypeScript/TSX source files scanned: 92.
- TypeScript syntax transpile check: passed for 91 non-declaration files.
- Internal `@/` import resolution: passed.
- External import-to-`package.json` dependency coverage: passed.
- Broad TypeScript semantic check with temporary external-module stubs: passed.
- Placeholder route scan (`href="#"` and `to="#"`): passed.
- Emoji/pictograph scan across source and documentation: passed.
- Patient 5-point and 9-point calibration paths are present.
- Four-item AAC paging and gaze-friendly next-page control are present.
- Manual SOS is mounted at Patient layout level and remains independent from the camera provider.
- Firebase Hosting SPA rewrite, Nginx SPA fallback, PWA manifest and CI workflow are included.

## Automated tests included

- Base button rendering/loading state.
- Browser camera capability mapping.
- AAC data paging assumptions.
- Gaze target quick manual press and dwell selection behavior.

## Environment limitation

A complete `npm install`, production Vite build, ESLint run and Vitest execution could not be completed in the generation container because access to the npm registry timed out. No `node_modules` or partial lockfile was included.

Run the following in a normal networked development environment:

```bash
npm install
npm run validate:structure
npm run typecheck
npm run lint
npm run test:run
npm run build
```

Treat any package-manager or browser-specific issue discovered there as a release blocker before deployment.
