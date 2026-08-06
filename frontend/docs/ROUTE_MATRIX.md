# OcuSpeak Route Matrix

This matrix maps each route to its purpose, upstream dependency, main interaction and expected next route. All routes are declared in `src/app/router.tsx`.

## Public and demo

| Route | Purpose | Main actions | Next routes |
|---|---|---|---|
| `/` | Product landing and competition overview | Open Patient demo, open Caregiver demo, read privacy and requirements | `/patient/connect`, `/care/login`, `/demo`, `/privacy`, `/requirements` |
| `/demo` | End-to-end demo guide | Start each side of the demo | `/patient/connect`, `/care/login` |
| `/requirements` | Browser, camera and device readiness | Run capability checks and continue | `/patient/connect`, `/unsupported` |
| `/privacy` | Camera and data boundary | Review allowed and prohibited payloads | `/patient/connect` |
| `/unsupported` | Recovery when the browser is unsupported | Return to requirements or use manual mode | `/requirements`, `/patient/connect` |
| `/style-guide` | Visual tokens and reusable components | Inspect component states | No workflow dependency |

## Patient Web

| Route | Purpose | Main interactions | Next routes |
|---|---|---|---|
| `/patient/connect` | Pair a patient session using a six-character code | Validate code, handle invalid/expired state | `/patient/permissions` |
| `/patient/permissions` | Explain and request camera permission | Request camera, continue without camera | `/patient/device-setup` |
| `/patient/device-setup` | Check distance, light, face position and local preview | Start camera, stop camera, choose calibration | `/patient/calibration` |
| `/patient/calibration` | Five-point calibration mock and integration surface | Pause, reset, collect points, switch to manual | `/patient/calibration/result`, `/patient/aac` |
| `/patient/calibration/result` | Show READY or retry recommendation | Retry or open AAC board | `/patient/calibration`, `/patient/aac` |
| `/patient/aac` | Four-category gaze-first board | Dwell/click category, inspect composer, Manual SOS | `/patient/aac/:categoryId`, `/patient/compose`, `/patient/sos` |
| `/patient/aac/:categoryId` | Stable four-item AAC page | Select item, next/previous page, return to categories | `/patient/compose`, `/patient/aac` |
| `/patient/compose` | Review selected items and generate a sentence | Remove, clear, deterministic/Gemini mock, confirm, TTS | `/patient/request/:eventId` |
| `/patient/request/:eventId` | Track request lifecycle | Read SENT/RECEIVED/PROCESSING/COMPLETED state | `/patient/aac` |
| `/patient/reassurance` | Display caregiver reassurance | Play browser TTS and dismiss | `/patient/aac` |
| `/patient/sos` | Manual SOS active state | Send, show acknowledgement state, cancel only before submit | `/patient/aac` |
| `/patient/check-required` | Non-diagnostic quality warning | Fix camera setup or continue manually | `/patient/device-setup`, `/patient/aac` |
| `/patient/offline` | Local minimal board and queued events | Use essential items and retry connection | `/patient/aac` |

## Caregiver Web/PWA

| Route | Purpose | Main interactions | Next routes |
|---|---|---|---|
| `/care/login` | Caregiver authentication mock | Validate form and sign in | `/care/dashboard`, `/care/onboarding` |
| `/care/onboarding` | Create caregiver and patient profile | Complete setup steps | `/care/pair` |
| `/care/pair` | Show QR and invitation code | Copy code, continue to dashboard | `/care/dashboard` |
| `/care/dashboard` | Current patient, request, alert and system summary | Open request, alert, analytics and quick reassurance | Care modules |
| `/care/patient/:patientId` | Patient profile and current configuration | Request recalibration, edit settings, manage link | `/care/settings`, `/care/devices` |
| `/care/communications` | Searchable communication inbox | Filter and open event | `/care/communications/:eventId` |
| `/care/communications/:eventId` | Communication lifecycle and reassurance | Acknowledge, process, complete, TTS preview, send reassurance | `/care/communications` |
| `/care/alerts` | Separate active and resolved alerts | Filter and open alert | `/care/alerts/:alertId` |
| `/care/alerts/:alertId` | Reason codes, quality data and acknowledgement | Acknowledge, checking, resolve, send reassurance | `/care/alerts` |
| `/care/aac` | AAC category manager and Patient preview | Open category, add item, inspect Patient board | `/care/aac/category/:categoryId`, `/care/aac/item/new`, `/patient/aac` |
| `/care/aac/category/:categoryId` | Manage item visibility and draft deletion | Search, hide/show, edit, remove, preview paging | `/care/aac/item/:itemId/edit` |
| `/care/aac/item/new` | Create an AAC item | Validate content and save | `/care/aac/category/:categoryId` |
| `/care/aac/item/:itemId/edit` | Edit existing AAC item | Validate, preview, save or remove | `/care/aac/category/:categoryId` |
| `/care/presets` | Situation-based four-item presets | Activate, duplicate and create drafts | `/care/aac` |
| `/care/reassurance` | Saved caregiver messages and audio adapter | Preview TTS, send, prepare recording/upload | Patient realtime channel |
| `/care/history` | Care log filters and event timeline | Search and filter | Detail routes |
| `/care/analytics` | Usage, completion and quality summaries | Change period and inspect charts | `/care/history` |
| `/care/settings` | Grid, dwell, TTS and feature flags | Save local demo settings | `/care/aac`, `/care/patient/:patientId` |
| `/care/devices` | Linked device status | Create pairing code and simulate unlink | `/care/pair` |
| `/care/notifications` | Browser permission and notification preferences | Request permission, send test, play alert sound | `/care/dashboard` |
