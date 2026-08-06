# Manual QA Script

## Core Patient journey

1. Open `/requirements` and verify camera/browser capability rows render without crashing.
2. Open `/patient/connect`, submit an invalid code, then submit `AN2026`.
3. On `/patient/permissions`, allow camera once and verify one local preview stream is reused on `/patient/device-setup`.
4. Complete all five calibration points. Verify the result page offers both retry and continue.
5. Open each AAC category. Verify four cards stay in fixed positions and the down/next control moves to the next four items.
6. Select at least two items, open the composer, generate a sentence, play the browser TTS fallback, confirm and submit.
7. Verify request status shows a lifecycle and returns to the AAC board.
8. Trigger Manual SOS from multiple Patient routes. Verify it is always reachable and does not depend on camera.
9. Set the browser offline. Verify the banner and `/patient/offline` fallback board remain usable.

## Core Caregiver journey

1. Login with `caregiver@ocuspeak.demo` and `demo2026`.
2. Open every sidebar route and verify active navigation state.
3. Open communication detail, progress the lifecycle and send a reassurance message.
4. Open alert detail, acknowledge, mark checking and resolve.
5. In AAC manager, open each category. Hide and remove draft items and verify preview paging updates immediately.
6. Create/edit an AAC item. Trigger required-field validation and then save.
7. Activate a preset and confirm a success toast appears.
8. Request browser notification permission and send a test where supported.
9. Resize to mobile. Verify bottom navigation, sidebar drawer and all primary actions remain reachable.

## Failure and edge cases

- Invalid and expired pairing code.
- Camera denied, camera unavailable and camera stopped.
- Face off center / low light guidance screen.
- Unknown AAC category and unknown event IDs.
- Empty search/filter results.
- Offline communication queue.
- Gemini/TTS mock failure boundary.
- Reduced motion enabled.
- Keyboard-only navigation.
- 200% browser zoom.
