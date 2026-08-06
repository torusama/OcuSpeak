# OcuSpeak Frontend

Complete React + TypeScript + Vite + Tailwind implementation of the OcuSpeak frontend specification.

## Included products

- Public competition/demo website.
- Patient Web with pairing, permissions, device setup, calibration UI, AAC category board, four-item paging, sentence composer, request status, reassurance, Manual SOS, CHECK_REQUIRED and offline fallback.
- Caregiver Web/PWA with login, onboarding, pairing, dashboard, patient overview, communication inbox/detail, alert inbox/detail, AAC manager, category/item editor, presets, reassurance, care log, analytics, settings, device management and notification settings.
- OcuSpeak style guide at `/style-guide`.
- PWA manifest and service worker configuration.
- Firebase adapter boundary, mock API layer, shared camera provider and persistent local UI store.
- Unit tests for shared UI, capabilities and AAC paging data.

## Important implementation boundary

This repository implements the complete frontend UI and working demo interactions. The following areas are intentionally adapters or simulations because they require the separate backend/AI Engine:

- Firebase Authentication, Firestore, Storage and FCM.
- MediaPipe Face Landmarker and WebGazer regression output.
- Gemini structured output endpoint.
- Google Cloud Text-to-Speech endpoint.
- Safety Decision Engine and rPPG worker.

`VITE_USE_MOCKS=true` is the default. Camera permission and local preview use the real browser `getUserMedia()` API. No camera frame is sent by the provided frontend.

## Start locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run typecheck
npm run test:run
npm run build
npm run preview
```

## Demo credentials and pairing

- Caregiver mock email: `caregiver@ocuspeak.demo`
- Caregiver mock password: `demo2026`
- Pair code: `AN2026`

Mock login accepts any valid email and a password containing at least six characters.

## Route map

### Public

- `/`
- `/demo`
- `/requirements`
- `/privacy`
- `/unsupported`
- `/style-guide`

### Patient

- `/patient/connect`
- `/patient/permissions`
- `/patient/device-setup`
- `/patient/calibration`
- `/patient/calibration/result`
- `/patient/aac`
- `/patient/aac/:categoryId`
- `/patient/compose`
- `/patient/request/:eventId`
- `/patient/reassurance`
- `/patient/sos`
- `/patient/check-required`
- `/patient/offline`

### Caregiver

- `/care/login`
- `/care/onboarding`
- `/care/pair`
- `/care/dashboard`
- `/care/patient/:patientId`
- `/care/communications`
- `/care/communications/:eventId`
- `/care/alerts`
- `/care/alerts/:alertId`
- `/care/aac`
- `/care/aac/category/:categoryId`
- `/care/aac/item/new`
- `/care/aac/item/:itemId/edit`
- `/care/presets`
- `/care/reassurance`
- `/care/history`
- `/care/analytics`
- `/care/settings`
- `/care/devices`
- `/care/notifications`

## Design system

- Primary typeface: Nunito.
- Display typeface: Feather Bold with Nunito fallback.
- All UI icons: `lucide-react`.
- No emoji in the interface.
- Main palette:
  - Ocu Red `#CC1400`
  - Ocu Orange `#FFAD33`
  - Ocu Yellow `#FFEC89`
  - Ocu Green `#6BAA75`
  - Ocu Pink `#C28CAE`
  - Ocu Purple `#967CC7`
  - Ocu Indigo `#4C57A9`
  - Ocu Blue `#6698CC`

## Privacy guardrail

The implementation does not upload video, camera frames, screenshots, face/eye crops, full landmarks or raw rPPG RGB buffers. Keep this boundary when replacing mock services with production adapters.

## Deployment

Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

Cloud Run container:

```bash
docker build -t ocuspeak-frontend .
docker run -p 8080:8080 ocuspeak-frontend
```

## Handoff documentation

- `docs/FRONTEND_SPEC.md`: complete implementation specification used as the source of truth.
- `docs/ROUTE_MATRIX.md`: every route, purpose, interaction and next route.
- `docs/API_INTEGRATION.md`: Firebase, Cloud Run, Gemini, TTS, camera AI and safety adapter boundaries.
- `docs/PRIVACY_AND_SAFETY_CHECKLIST.md`: production release checklist.
- `docs/MANUAL_QA.md`: end-to-end and edge-case test script.
- `docs/RESEARCH_REFERENCES.md`: official AAC, gaze-access and child-learning design references.
- `docs/VALIDATION_REPORT.md`: checks completed in the generation environment and remaining build commands.
- `docs/assets/ocuspeak-palette-reference.png`: palette reference supplied with the project brief.

## Source-only structural validation

This command uses Node.js built-ins and does not require installed dependencies:

```bash
npm run validate:structure
```
