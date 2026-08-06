# Privacy and Safety Checklist

Run this checklist before every production release.

## Client camera boundary

- [ ] One camera stream per Patient session.
- [ ] No camera frame is serialized, uploaded or written to persistent storage.
- [ ] No face/eye crop or full landmark vector appears in analytics, logs or crash reports.
- [ ] rPPG RGB buffers stay in RAM and are discarded when the session ends.
- [ ] Camera permission is requested only after a clear user action.
- [ ] Manual AAC and Manual SOS remain available when permission is denied.

## Network payloads

- [ ] Events contain pseudonymous patient IDs.
- [ ] Every important write has an `eventId` and schema version.
- [ ] Gemini receives AAC text/item context only.
- [ ] Text-to-Speech receives confirmed text only.
- [ ] Backend rejects unexpected image/video/biometric payload fields.
- [ ] Retry logic reuses the same idempotency key.

## Safety language

- [ ] rPPG is labeled as an experimental camera estimate.
- [ ] `CHECK_REQUIRED` is not displayed as a diagnosis.
- [ ] Automatic `RED_ALERT` is feature-flagged and disabled by default.
- [ ] Manual SOS works while camera, gaze, Gemini or TTS are unavailable.
- [ ] Caregiver acknowledgement is visible on both sides.
- [ ] Alert reason codes and config version are retained for audit.

## Access control

- [ ] Caregiver A cannot read or edit Caregiver B's patient.
- [ ] Storage paths are authorized and validate file type/size.
- [ ] Firebase rules are tested in an emulator or rules test suite.
- [ ] Tokens and secrets are redacted from logs.
- [ ] Production source maps and error reports do not expose private payloads.

## Accessibility

- [ ] Patient targets meet the gaze-first target size defined in the frontend spec.
- [ ] Focus order works by keyboard.
- [ ] Reduced-motion preferences are respected.
- [ ] Text alternatives exist for custom AAC images.
- [ ] Status is not communicated by color alone.
- [ ] Zoom at 200% does not hide Manual SOS or composer controls.
