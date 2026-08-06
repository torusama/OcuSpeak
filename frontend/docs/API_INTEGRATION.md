# Backend and AI Integration Guide

The repository runs in mock mode by default. Keep the component and route contracts stable while replacing mock modules with production adapters.

## Environment modes

`VITE_USE_MOCKS=true` uses `src/services/api/mockApi.ts`. Set it to `false` only after Firebase and Cloud Run variables are configured.

Required client variables are documented in `.env.example`. Never place a service-account key, Gemini secret or Text-to-Speech service credential in the frontend bundle.

## Adapter boundaries

### Authentication and pairing

Replace `fakeLogin()` and `verifyPairCode()` with Firebase Authentication and an authenticated Cloud Run pairing endpoint. The pairing response should return a pseudonymous patient ID and relationship permissions, not a detailed medical profile.

### AAC board realtime channel

The Caregiver editor writes categories/items to Firestore or Cloud Run. Patient Web listens to a published board version. Apply changes only at a safe checkpoint so a dwell target does not move while the user is selecting it.

Recommended fields:

```ts
{
  boardId: string;
  version: number;
  publishedAt: string;
  categories: AacCategory[];
  items: AacItem[];
}
```

### Communication workflow

Replace `generateSentence()` with a Cloud Run endpoint that calls Gemini structured output and validates the response again. Keep deterministic fallback generation in the frontend or backend.

Replace `submitCommunication()` with an idempotent endpoint. Generate `eventId` before the first request and reuse it during retries.

Expected lifecycle:

```text
QUEUED_LOCAL -> SENT -> RECEIVED -> PROCESSING -> COMPLETED
                               \-> FAILED (retryable when classified)
```

### Reassurance and TTS

Caregiver sends normalized text/audio metadata through the backend. Patient Web receives a realtime command and displays text before playing audio. Browser speech synthesis is only a demo fallback. Production TTS credentials remain on Cloud Run.

### Camera AI

`CameraProvider` owns the single `getUserMedia` stream. The production `CameraFrameCoordinator` must distribute the same stream/timestamps to MediaPipe, gaze, camera-quality and optional rPPG workers.

Never upload:

- Video or still camera frames.
- Face or eye crops.
- Full landmark arrays.
- Raw RGB rPPG buffers.
- Long-term biometric templates.

Only normalized quality/confidence/state events may cross the network boundary.

### Safety

Manual SOS must work without camera and bypass non-critical queues. Automatic alerts stay disabled until integration tests pass. Low confidence creates `CHECK_REQUIRED`, not a medical conclusion.

Each alert write should contain:

```ts
{
  eventId: string;
  severity: 'CHECK_REQUIRED' | 'RED_ALERT';
  source: 'MANUAL_SOS' | 'AUTOMATIC_RULE';
  reasonCodes: string[];
  configVersion: string;
  occurredAt: string;
}
```

## Error mapping

Map backend codes to actionable UI states. Do not display raw stack traces or provider errors to Patient Web.

| Code | Patient behavior | Caregiver behavior |
|---|---|---|
| `PAIR_CODE_INVALID` | Keep input and explain format | Offer a new code |
| `PAIR_CODE_EXPIRED` | Return to pairing | Regenerate invitation |
| `CAMERA_DENIED` | Offer manual mode | Show setup instructions |
| `LOW_TRACKING_CONFIDENCE` | Pause dwell | Show `CHECK_REQUIRED` reason |
| `GEMINI_TIMEOUT` | Use deterministic sentence | Record fallback flag |
| `TTS_UNAVAILABLE` | Keep readable sentence | Show delivery warning |
| `NETWORK_OFFLINE` | Queue locally | Show reconnect banner |
| `DUPLICATE_EVENT` | Treat as success | Do not duplicate notification |
