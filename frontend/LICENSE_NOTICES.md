# Third-party Notices

This frontend source references the following third-party packages through `package.json`. Review and retain the license text of the exact installed versions before redistribution.

- React, React DOM and React Router.
- Vite and TypeScript.
- Tailwind CSS, PostCSS and Autoprefixer.
- Lucide React.
- Zustand, TanStack Query, React Hook Form and Zod.
- Recharts and QRCode React.
- Firebase Web SDK.
- Vitest, Testing Library and ESLint tooling.

MediaPipe, WebGazer, heartbeat-js, rPPG reference repositories, Gemini and Google Cloud Text-to-Speech are not bundled as working production dependencies in this frontend package. When those modules are integrated, pin exact versions/commits and add their notices. In particular, review the GPL obligations described in the project technical specification before distributing a build that includes WebGazer or heartbeat-js code.

The remote Orbis hero video URL and externally hosted fonts are references supplied in the project design brief. Confirm usage rights and availability before production release. Prefer self-hosting approved assets for a reliable demo.
