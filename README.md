# OcuSpeak (GazeCommunicate)

> Nền tảng giao tiếp AAC bằng ánh mắt và theo dõi an toàn không tiếp xúc dành cho người dùng gặp hạn chế vận động và lời nói.

- Cuộc thi: AI Riser Vietnam 2026.
- Phạm vi MVP: quy mô gia đình, một người bệnh và một người giám hộ.
- Nguyên tắc cốt lõi: camera được xử lý trực tiếp trên thiết bị; backend không nhận video thô, ảnh khuôn mặt, eye crop, face crop, landmarks đầy đủ hoặc chuỗi RGB rPPG thô.
- Gaze, facial distress, camera quality và rPPG không gọi API bên ngoài để tính toán.
- Gemini và Text-to-Speech chỉ nhận dữ liệu văn bản hoặc sự kiện đã chuẩn hóa, không nhận dữ liệu camera.

---
`
## 1. Bài toán và giá trị của OcuSpeak

- OcuSpeak giúp người dùng không thể nói hoặc thao tác tay giao tiếp bằng cách nhìn vào các ô AAC trên màn hình.
- Người dùng giữ ánh mắt tại một ô trong khoảng cấu hình, mặc định 1.5–2.0 giây, để thực hiện Dwell Click.
- Các lựa chọn AAC được ghép thành câu tự nhiên bằng Gemini và phát lại bằng giọng nói tổng hợp.
- Người giám hộ có thể tùy chỉnh bảng AAC, thêm hình ảnh quen thuộc, theo dõi lịch sử nhu cầu và gửi lời trấn an từ xa.
- Hệ thống có Manual SOS luôn hoạt động và một Safety Decision Engine thử nghiệm sử dụng camera quality, khả năng thao tác AAC, facial distress và rPPG có confidence gate.
- OcuSpeak không phải thiết bị y tế, không chẩn đoán bệnh và không thay thế đánh giá của nhân viên y tế.

---

## 2. Phạm vi MVP

### Trong phạm vi

- Patient Web cho người bệnh.
- Caregiver Web/PWA cho người giám hộ.
- Bảng AAC phân cấp theo cách tổ chức kiểu PECS.
- Calibration ánh mắt 5 điểm và 9 điểm.
- Gaze mapping, smoothing, dwell click và tracking confidence.
- Manual SOS.
- Camera quality gate và trạng thái `CHECK_REQUIRED`.
- Facial distress state machine dựa trên tín hiệu quan sát được.
- rPPG nhịp mạch ở mức thử nghiệm, chỉ hiển thị khi confidence đạt.
- Gemini structured output để tạo câu từ lựa chọn AAC.
- Text-to-Speech để phát câu và lời trấn an.
- Đồng bộ thời gian thực giữa Patient Web và Caregiver App.
- Push notification cho nhu cầu, SOS và xác nhận của người giám hộ.
- Dashboard phân tích thói quen giao tiếp và trạng thái hệ thống.
- Deploy production trên Google Cloud/Firebase để có link demo công khai.

### Không nằm trong MVP

- Không chẩn đoán đau, co giật, khó thở, đột quỵ hoặc bệnh lý khác.
- Không tuyên bố rPPG đạt độ chính xác y khoa.
- Không tự động gọi cấp cứu ngoài hệ thống.
- Không upload hoặc lưu video camera.
- Không xây hệ thống bệnh viện nhiều bệnh nhân/nhiều y tá trong giai đoạn này.
- Không triển khai load balancing bằng Counting Semaphore trong MVP gia đình.
- Không train lại Face Landmarker, Image Segmenter, Gemini hoặc một mô hình thị giác mới.

---

## 3. Kiến trúc tổng thể

```text
Patient Web
  - AAC Grid
  - CameraFrameCoordinator
  - MediaPipe Face Landmarker
  - Optional MediaPipe Image Segmenter
  - WebGazer regression/calibration
  - Facial distress state machine
  - rPPG experimental worker
  - Manual SOS
        |
        | normalized events only
        v
Cloud Run Backend
  - Firebase token verification
  - Event validation and idempotency
  - Gemini sentence service
  - Text-to-Speech service
  - Safety/notification orchestration
  - Aggregation APIs
        |
        +--> Firebase Authentication
        +--> Cloud Firestore
        +--> Cloud Storage for Firebase
        +--> Firebase Cloud Messaging
        +--> Firebase Remote Config
        +--> Cloud Logging / Error Reporting
        |
        v
Caregiver Web/PWA
  - AAC customization
  - Reassurance command
  - SOS alert and acknowledgement
  - History and analytics
```

### Quy tắc kiến trúc bắt buộc

- Chỉ tạo một `getUserMedia` stream cho mỗi phiên Patient Web.
- Chỉ tạo một MediaPipe Face Landmarker instance trong pipeline chính.
- Một `CameraFrameCoordinator` phân phối frame và timestamp cho các module.
- Không chạy face detector riêng của WebGazer hoặc heartbeat-js trong production.
- Image Segmenter là nhánh bổ trợ, không được chạy ở mọi frame nếu thiết bị yếu.
- UI AAC và Manual SOS luôn có mức ưu tiên cao hơn rPPG.
- Backend chỉ nhận dữ liệu tổng hợp, reason codes và timestamps.
- Mọi event quan trọng phải có `eventId` để chống gửi trùng.

---

## 4. Stack kỹ thuật cuối cùng

### Patient Web

- React + TypeScript + Vite.
- Tailwind CSS hoặc design system hiện có của nhóm.
- `navigator.mediaDevices.getUserMedia()` để mở camera.
- `requestVideoFrameCallback()` khi browser hỗ trợ.
- Google MediaPipe Tasks Vision chạy local trong browser.
- MediaPipe Face Landmarker cho face landmarks, iris/eye features và blendshapes.
- MediaPipe Image Segmenter dùng bổ trợ cho person-presence/background mask khi cần.
- `brownhci/WebGazer` được vendor/pin commit và chỉ giữ calibration + regression mapping.
- Custom `MediaPipeTrackerAdapter` cung cấp feature từ Face Landmarker cho WebGazer.
- Web Worker cho rPPG và các bước lọc tín hiệu nặng.
- IndexedDB/local storage chỉ lưu cấu hình không nhạy cảm và calibration tạm thời theo chính sách của nhóm.

### rPPG

- `prouast/heartbeat-js` chỉ làm code nền tham khảo cho pipeline JavaScript.
- ROI trán và hai má lấy từ MediaPipe, không dùng detector cũ của repository.
- Benchmark offline bằng `pavisj/rppg-pos` hoặc `ubicomplab/rPPG-Toolbox`.
- So sánh GREEN, CHROM và POS, sau đó chỉ chọn một thuật toán cho MVP browser.
- Buffer trong RAM chỉ chứa RGB trung bình và timestamp; không chứa frame ảnh.

### Backend và Google Cloud

- Node.js + TypeScript trên Cloud Run.
- Firebase Admin SDK để xác thực token, truy cập Firestore và gửi FCM.
- Firebase Authentication cho account người giám hộ và liên kết phiên.
- Cloud Firestore cho dữ liệu nghiệp vụ và realtime listeners.
- Cloud Storage for Firebase cho ảnh AAC do người giám hộ tải lên.
- Firebase Cloud Messaging cho push notification.
- Firebase Remote Config cho dwell time, confidence threshold, persistence, cooldown và feature flags.
- Gemini API với structured output cho tạo câu AAC.
- Google Cloud Text-to-Speech cho audio của câu và lời trấn an.
- Cloud Logging cho structured logs của Cloud Run.
- Error Reporting để gom nhóm exception backend.
- Firebase Hosting cho frontend hoặc frontend container trên Cloud Run; ưu tiên Firebase Hosting + Cloud Run API để đơn giản hóa MVP.
- Artifact Registry và Cloud Build/GitHub Actions cho build và deploy.

---

## 5. Google-first integration map

- **Face model chính:** MediaPipe Face Landmarker của Google.
- **Person-presence phụ trợ:** MediaPipe Image Segmenter của Google.
- **WebGazer:** chỉ giữ thuật toán calibration/regression; dữ liệu tracking production do MediaPipe cung cấp.
- **Sentence generation:** Gemini structured output.
- **Speech:** Google Cloud Text-to-Speech.
- **Authentication và dữ liệu:** Firebase Authentication + Firestore.
- **Ảnh AAC:** Cloud Storage for Firebase.
- **Thông báo:** Firebase Cloud Messaging.
- **Threshold và feature flags:** Firebase Remote Config.
- **Hosting/backend:** Firebase Hosting + Cloud Run.
- **Observability:** Cloud Logging + Error Reporting.

### Ghi chú về WebGazer

- OcuSpeak không dùng WebGazer như một black box nhận diện mặt hoàn chỉnh.
- Production gaze pipeline sử dụng MediaPipe Face Landmarker làm nguồn feature duy nhất.
- WebGazer chỉ phụ trách calibration samples, regression ridge và ánh xạ feature sang tọa độ màn hình.
- Vì vậy model/runtime nhận diện trong pipeline gaze vẫn là Google MediaPipe; phần còn lại là thuật toán hồi quy toán học và code tích hợp của nhóm.
- Phải pin commit, lưu license notice và kiểm tra nghĩa vụ GPLv3 trước khi phân phối.

### Ghi chú về Image Segmenter

- Image Segmenter không thay thế Face Landmarker.
- Nó chỉ hỗ trợ xác nhận person presence hoặc mask foreground khi Face Landmarker không ổn định.
- Không được kết luận “camera bị che” chỉ dựa vào segmentation; cần kết hợp độ sáng, contrast, blur, face visibility và foreground ratio.
- Để giảm CPU, chạy ở tần suất thấp, ví dụ 2–4 lần/giây, hoặc chỉ kích hoạt khi Face Landmarker mất mặt liên tục.
- Nếu FPS AAC giảm hoặc laptop quá nóng, tắt Image Segmenter bằng Remote Config và quay về camera quality heuristics.

---

## 6. Luồng dữ liệu camera và safety

```text
CameraFrameCoordinator
  |
  +--> Camera Quality Gate
  |      - brightness
  |      - contrast
  |      - blur/motion
  |      - face visibility
  |      - optional foreground/person ratio
  |
  +--> MediaPipe Face Landmarker
         |
         +--> Gaze Feature Adapter
         |      --> WebGazer Regression
         |      --> Gaze Smoother
         |      --> AAC Dwell Controller
         |
         +--> Facial Features
         |      --> Temporal Distress State Machine
         |
         +--> Forehead/Cheek ROI
                --> rPPG Worker
                --> BPM + monitoringConfidence

Manual SOS -------------------------------------------------------+
Gaze usability ----------------------------------------------------|
Facial state -------------------------------------------------------|--> Safety Decision Engine
rPPG state ---------------------------------------------------------|
Camera quality ----------------------------------------------------+
                                                                   |
                                                                   +--> NORMAL
                                                                   +--> CHECK_REQUIRED
                                                                   +--> RED_ALERT
```

### Safety rules

- Manual SOS tạo `RED_ALERT` ngay lập tức.
- Confidence thấp tạo `CHECK_REQUIRED`, không tạo kết luận y khoa.
- Một tín hiệu tự động đơn lẻ không đủ tạo `RED_ALERT`.
- Automatic `RED_ALERT` chỉ được bật khi nhiều tín hiệu kéo dài, confidence đạt và logic đã qua test.
- Có cooldown, idempotency và acknowledgement để không gửi cảnh báo lặp.
- Nếu rPPG chưa đáng tin cậy, tắt `enable_auto_red_alert` và vẫn demo Manual SOS + `CHECK_REQUIRED`.

---

## 7. Firebase Remote Config

### Các key đề xuất

```text
dwell_duration_ms
calibration_mode_default
gaze_confidence_min
calibration_error_px_max
face_loss_check_ms
distress_persistence_ms
prolonged_eye_closure_ms
rppg_confidence_min
rppg_window_seconds
alert_cooldown_ms
image_segmenter_enabled
auto_red_alert_enabled
rppg_enabled
gemini_sentence_enabled
```

### Quy tắc an toàn khi dùng Remote Config

- Mỗi key phải có default được bundle trong app.
- Validate type và giới hạn min/max trước khi áp dụng.
- Lưu `configVersion` vào event/log để truy vết.
- Giữ last-known-good config nếu fetch lỗi.
- Không để một thay đổi Remote Config vô tình vô hiệu hóa Manual SOS.
- `auto_red_alert_enabled` mặc định `false` cho đến khi test tích hợp đạt.
- Không thay đổi threshold giữa một phiên đang calibration; áp dụng ở phiên kế tiếp hoặc tại safe checkpoint.
- Có nút rollback template trong Firebase Console và ghi lại người thay đổi trong tài liệu vận hành.

---

## 8. Data model tối thiểu

### Collections

```text
users/{userId}
caregiverLinks/{linkId}
patientProfiles/{patientId}
aacBoards/{boardId}
aacBoards/{boardId}/items/{itemId}
sessions/{sessionId}
communicationEvents/{eventId}
safetyEvents/{eventId}
alertAcknowledgements/{ackId}
reassuranceCommands/{commandId}
analyticsDaily/{patientId_date}
```

### Dữ liệu được phép gửi lên backend

- AAC item ID đã chọn.
- Câu đã tạo và được người dùng xác nhận.
- Calibration status tổng quát.
- Tracking confidence và validation error.
- Facial/distress state đã tổng hợp.
- BPM thử nghiệm khi confidence đạt.
- Camera quality state và reason codes.
- Manual SOS, alert state và caregiver acknowledgement.
- Timestamp, session ID và pseudonymous patient ID.

### Dữ liệu không được gửi

- Video thô.
- Camera frame hoặc screenshot khuôn mặt.
- Eye crop, face crop hoặc ROI ảnh.
- Face landmarks đầy đủ.
- Chuỗi RGB rPPG thô.
- Biometric template dài hạn.
- Debug frame dump trên production.

---

# 9. Kế hoạch triển khai theo 9 task lớn

> Các task được mô tả theo phạm vi chức năng, kỹ thuật sử dụng, đầu ra và điều kiện nghiệm thu. Phần thời gian và người phụ trách được quản lý ở task sheet riêng, không lặp lại trong README kỹ thuật.

## Task 1 — System Foundation, Architecture & Shared Contracts

- **Phụ thuộc:** Không.
- **Mục tiêu:** Tạo nền tảng chung để Patient Web, Caregiver App, AI/CV và backend làm song song mà không lệch contract.

### Chức năng cần làm

- Khởi tạo cấu trúc repository cho `patient-web`, `caregiver-web`, `backend` và `shared`.
- Thiết lập TypeScript strict mode, lint, format, environment variables và commit rules.
- Tạo Firebase project dev/demo và Google Cloud project tương ứng.
- Cấu hình Firebase Authentication, Firestore, Storage, FCM và Remote Config.
- Tạo Cloud Run backend skeleton và health endpoint.
- Định nghĩa shared types cho AAC event, gaze state, safety state, notification và acknowledgement.
- Định nghĩa `eventId`, `sessionId`, `patientId`, timestamp và schema version.
- Tạo Firestore Security Rules bản đầu.
- Tạo structured logger và correlation ID.
- Viết tài liệu privacy boundary: dữ liệu nào được và không được upload.

### Kỹ thuật sử dụng

- React + TypeScript + Vite.
- Node.js + TypeScript.
- Firebase Authentication, Firestore, Storage, FCM, Remote Config.
- Cloud Run, Cloud Logging, Error Reporting.
- JSON Schema/Zod để validate event contract.
- GitHub Actions hoặc Cloud Build.

### Deliverables

- Repository chạy được ở local.
- Shared contract package.
- Firebase dev project.
- Cloud Run `/health` trả thành công.
- Security Rules và env template.
- Architecture diagram và data flow ngắn trong README.

### Definition of Done

- [ ] Cả hai frontend import được shared types.
- [ ] Backend verify được Firebase ID token.
- [ ] Không có secret trong repository.
- [ ] Structured log có request ID và severity.
- [ ] Privacy rules được ghi rõ trước khi code camera.

---

## Task 2 — Patient AAC Interface & Manual Communication Core

- **Phụ thuộc:** Task 1.
- **Mục tiêu:** Có một giao diện AAC sử dụng được ngay cả khi gaze chưa hoàn tất.

### Chức năng cần làm

- Xây grid AAC ô lớn, tương phản cao và responsive.
- Tổ chức category phân cấp theo nhu cầu, cảm xúc, người liên quan và hành động.
- Hỗ trợ click chuột/touch/manual selection để test độc lập với gaze.
- Hiển thị dwell progress ring nhưng cho phép dùng mock gaze input ở giai đoạn đầu.
- Hiển thị item image, label, category và trạng thái được chọn.
- Xây sentence composer từ các item đã chọn.
- Có nút xóa item cuối, xóa câu, phát lại, xác nhận và gửi.
- Có animation/audio feedback sau lựa chọn.
- Có Manual SOS luôn hiển thị, không bị che bởi modal hoặc loading.
- Có trạng thái offline/reconnecting và fallback board local tối thiểu.
- Ghi `communicationEvent` chuẩn hóa khi item được chọn hoặc câu được xác nhận.

### Kỹ thuật sử dụng

- React, TypeScript, Tailwind CSS.
- Accessible HTML, ARIA labels, keyboard/touch support.
- Firestore realtime listener cho board config.
- Cloud Storage URL cho ảnh AAC.
- Shared event contracts từ Task 1.

### Deliverables

- Patient AAC screen hoàn chỉnh bằng manual input.
- Board mẫu có category và item demo.
- Sentence composer.
- Manual SOS.
- Component test cho grid, composer và SOS.

### Definition of Done

- [ ] Không cần camera vẫn giao tiếp được.
- [ ] Manual SOS hoạt động khi UI đang loading hoặc mất gaze.
- [ ] Item selection tạo event đúng schema.
- [ ] Grid dùng được trên laptop và tablet.
- [ ] Không có text/interaction quá nhỏ đối với người dùng mục tiêu.

---

## Task 3 — Camera AI: Gaze, Camera Quality, Facial State & rPPG Prototype

- **Phụ thuộc:** Task 1 và integration point từ Task 2.
- **Mục tiêu:** Hoàn thành core gaze demo; rPPG và automatic multi-signal SOS là phần thử nghiệm có cut rule.

### Chức năng bắt buộc P0

- Tạo `CameraFrameCoordinator` dùng một camera stream.
- Bundle/self-host MediaPipe WASM và model assets.
- Chạy MediaPipe Face Landmarker trong browser.
- Tạo `MediaPipeTrackerAdapter` cho WebGazer.
- Calibration 5 điểm và 9 điểm.
- Thu nhiều sample mỗi điểm và loại frame không hợp lệ.
- Tính validation error và `CalibrationStatus`.
- Gaze regression, smoothing, hysteresis và dwell controller.
- Pause/reset dwell khi mất gaze hoặc confidence thấp.
- Camera quality gate cho light, blur, motion, FPS và face visibility.
- Tạo `trackingConfidence` từ nhiều thành phần.
- Kết nối gaze output với AAC grid của Task 2.

### Chức năng nên làm P1

- Facial feature stream từ landmarks/blendshapes.
- Temporal state machine cho prolonged eye closure, possible distress và face not visible.
- Optional MediaPipe Image Segmenter cho person-presence/foreground ratio.
- Image Segmenter chạy tần suất thấp hoặc chỉ khi Face Landmarker mất mặt.
- `CHECK_REQUIRED` khi camera/face/gaze không đủ chất lượng.

### Chức năng thử nghiệm P2

- ROI trán, má trái và má phải từ landmarks.
- rPPG buffer trong RAM.
- Web Worker cho detrend, band-pass và spectral analysis.
- Feasibility comparison POS/CHROM/GREEN bằng tool local.
- `monitoringConfidence` từ valid frame ratio, ROI stability, light, motion, SNR và estimate stability.
- BPM trả `null` khi confidence thấp.
- UI nhãn “Ước tính thử nghiệm từ camera”.

### Kỹ thuật sử dụng

- Google MediaPipe Face Landmarker.
- Optional Google MediaPipe Image Segmenter.
- WebGazer regression/calibration, pin commit.
- heartbeat-js làm reference, không dùng detector cũ.
- rppg-pos hoặc rPPG-Toolbox cho benchmark offline.
- Web Worker, requestVideoFrameCallback, typed arrays và ring buffer.

### Deliverables

- Camera pipeline chạy trong Patient Web.
- Calibration 5/9 điểm.
- Gaze dwell chọn được AAC item.
- Tracking confidence và camera quality state.
- Facial state output.
- Báo cáo feasibility rPPG hoặc quyết định cắt rõ ràng.

### Definition of Done

- [ ] Chỉ một camera stream và một Face Landmarker.
- [ ] Calibration có validation error.
- [ ] Không click khi confidence thấp.
- [ ] Mất face không tạo click bằng gaze cũ.
- [ ] Không upload frame hoặc landmarks thô.
- [ ] rPPG output null khi quality không đạt.
- [ ] Image Segmenter có thể tắt bằng feature flag.

### Cut rule cho Task 3

- Gaze + AAC + Manual SOS + camera quality phải chạy được.
- Nếu rPPG chưa ổn, giữ experimental UI hoặc tắt khỏi decision tree.
- Nếu automatic multi-signal SOS chưa ổn, chỉ giữ Manual SOS và `CHECK_REQUIRED`.

---

## Task 4 — Backend, Firebase Data Layer & Patient–Caregiver Pairing

- **Phụ thuộc:** Task 1.
- **Mục tiêu:** Cung cấp backend và data layer ổn định cho toàn bộ luồng family-scale.

### Chức năng cần làm

- Đăng nhập người giám hộ bằng Firebase Authentication.
- Tạo patient profile và caregiver profile.
- Tạo luồng pairing bằng invitation code/QR code có expiry.
- Kiểm tra quyền caregiver chỉ truy cập patient đã liên kết.
- CRUD AAC board, category và item.
- Signed/authorized upload ảnh AAC lên Cloud Storage.
- Ingest communication event và safety event đã chuẩn hóa.
- Validate schema, event version và timestamp.
- Idempotency theo `eventId`.
- API acknowledgement cho SOS/notification.
- API remote reassurance command.
- Aggregation endpoint cho dashboard.
- Audit fields: createdBy, updatedBy, createdAt, updatedAt.
- Firestore indexes và Security Rules.

### Kỹ thuật sử dụng

- Node.js + TypeScript trên Cloud Run.
- Firebase Admin SDK.
- Firebase Authentication custom claims hoặc Firestore role mapping.
- Cloud Firestore transactions/batches.
- Cloud Storage for Firebase.
- Zod/JSON Schema.
- Cloud Logging structured JSON.

### Deliverables

- API contracts và Postman/Bruno collection.
- Pairing flow.
- Firestore collections và indexes.
- Storage upload policy.
- Event ingestion và acknowledgement endpoints.

### Definition of Done

- [ ] Caregiver A không đọc được patient của Caregiver B.
- [ ] Event trùng `eventId` không tạo record/notification trùng.
- [ ] Upload chỉ nhận image type/size cho phép.
- [ ] Backend không chấp nhận camera frame hoặc raw biometric payload.
- [ ] API error không lộ secret hoặc PII trong log.

---

## Task 5 — Caregiver App & Real-time Customization

- **Phụ thuộc:** Task 2 và Task 4.
- **Mục tiêu:** Người giám hộ quản lý bảng AAC, nhận nhu cầu và phản hồi từ xa trong thời gian thực.

### Chức năng cần làm

- Login và chọn patient đã liên kết.
- Xem trạng thái online/offline của Patient Web.
- Xem bảng AAC hiện tại.
- Thêm/sửa/xóa/ẩn item AAC.
- Chụp/chọn ảnh, crop cơ bản, upload và gắn label.
- Sắp xếp item và category.
- Tạo preset theo buổi sáng/trưa/tối hoặc tình huống.
- Xem communication event mới theo thời gian thực.
- Gửi lời trấn an từ xa.
- Nhận SOS notification và bấm “Đã nhận”.
- Xem lịch sử nhu cầu và cảnh báo.
- Hiển thị rõ data quality: normal, check required, experimental rPPG.

### Kỹ thuật sử dụng

- React PWA + TypeScript.
- Firebase Authentication.
- Firestore realtime listeners.
- Cloud Storage for Firebase.
- Firebase Cloud Messaging.
- Service Worker cho PWA và background notification.

### Deliverables

- Caregiver dashboard.
- AAC editor.
- Reassurance action.
- Notification inbox và acknowledgement.
- Responsive/PWA build.

### Definition of Done

- [ ] Thay đổi AAC xuất hiện trên Patient Web gần thời gian thực.
- [ ] Ảnh AAC chỉ truy cập bởi tài khoản được phép.
- [ ] Alert acknowledgement cập nhật về Patient Web/backend.
- [ ] UI phân biệt rõ SOS thật, CHECK_REQUIRED và rPPG experimental.

---

## Task 6 — Gemini Sentence Generation, TTS & Reassurance Audio

- **Phụ thuộc:** Task 2 và Task 4.
- **Mục tiêu:** Chuyển các item AAC thành câu tự nhiên, dễ hiểu và phát bằng giọng nói.

### Chức năng cần làm

- Nhận danh sách AAC item đã chọn và context không nhạy cảm.
- Tạo prompt ngắn, kiểm soát mục đích: chỉ hoàn thiện câu giao tiếp.
- Sử dụng Gemini structured output với schema cố định.
- Output gồm câu, intent, tone và fallback flag.
- Không cho Gemini tạo tư vấn y khoa hoặc thay đổi trạng thái SOS.
- Có timeout và fallback deterministic template khi Gemini lỗi.
- Cho người dùng/caregiver xem và xác nhận câu trước khi lưu/phát.
- Gửi text đã xác nhận sang Cloud Text-to-Speech.
- Cache audio ngắn theo text/voice khi hợp lý.
- Reassurance command dùng câu mẫu được caregiver xác nhận.
- Ghi model ID, prompt version và latency, nhưng không ghi dữ liệu nhạy cảm.

### Kỹ thuật sử dụng

- Gemini API structured output.
- Google Gen AI SDK.
- Zod/JSON Schema để validate output lần hai.
- Google Cloud Text-to-Speech.
- Cloud Run backend.
- Firebase Remote Config cho feature flag/model name/fallback mode, không chứa secret.

### Deliverables

- Sentence generation endpoint.
- Fallback sentence builder.
- TTS endpoint/audio response.
- Patient Web sentence confirmation UI.
- Reassurance audio flow.

### Definition of Done

- [ ] Invalid Gemini output bị reject và dùng fallback.
- [ ] Không gửi video, image hoặc biometric data tới Gemini/TTS.
- [ ] Câu luôn cần xác nhận trước khi lưu như communication message.
- [ ] Gemini lỗi không làm AAC UI bị khóa.
- [ ] TTS lỗi có text fallback trên màn hình.

---

## Task 7 — Safety Decision Engine, Remote Config & Emergency Notifications

- **Phụ thuộc:** Task 3, Task 4 và Task 5.
- **Mục tiêu:** Xử lý Manual SOS và các tín hiệu an toàn có confidence gate, gửi cảnh báo không trùng và cho caregiver xác nhận.

### Chức năng cần làm

- Định nghĩa `NORMAL`, `CHECK_REQUIRED`, `RED_ALERT`.
- Manual SOS tạo `RED_ALERT` ngay, không phụ thuộc camera.
- Quality gate chặn dữ liệu confidence thấp khỏi nhánh automatic alert.
- Temporal persistence cho facial state và rPPG state.
- Session baseline cho rPPG thay vì threshold y khoa cứng.
- Cooldown và idempotency chống duplicate alert.
- Priority path: SOS gửi FCM ngay; notification thường đi luồng thông thường.
- Caregiver acknowledgement và thời gian phản hồi.
- Escalation UI khi chưa acknowledgement trong khoảng demo cấu hình.
- Remote Config cho threshold và feature flags.
- Last-known-good config, min/max guardrails và config version.
- `auto_red_alert_enabled` mặc định false cho đến khi test pass.
- Reason codes để giải thích vì sao `CHECK_REQUIRED` hoặc `RED_ALERT`.

### Kỹ thuật sử dụng

- TypeScript deterministic state machine/decision tree.
- Firebase Remote Config.
- Firebase Cloud Messaging.
- Firestore transaction/batch.
- Cloud Run orchestration.
- Cloud Logging cho alert lifecycle.

### Deliverables

- Safety Decision Engine.
- Remote Config template.
- FCM SOS notification.
- Alert acknowledgement flow.
- Test matrix cho normal/check/red.

### Definition of Done

- [ ] Manual SOS hoạt động khi camera tắt.
- [ ] Low confidence không tạo automatic RED_ALERT.
- [ ] Một event không gửi nhiều alert.
- [ ] Acknowledgement được đồng bộ hai chiều.
- [ ] Có thể tắt rPPG, Image Segmenter và automatic alert từ feature flag.
- [ ] Mỗi alert lưu config version và reason codes.

---

## Task 8 — Analytics, Observability, Privacy & System Testing

- **Phụ thuộc:** Task 2–Task 7.
- **Mục tiêu:** Có dashboard hữu ích, logs đủ debug nhưng không lộ dữ liệu, và bằng chứng kiểm thử rõ ràng.

### Chức năng cần làm

- Dashboard số lần chọn item/category theo ngày.
- Thống kê câu giao tiếp, thời gian sử dụng và tần suất caregiver acknowledgement.
- Thống kê calibration success/failure và average validation error.
- Thống kê CHECK_REQUIRED/RED_ALERT theo reason code.
- Không hiển thị rPPG như số đo y tế chính xác.
- Structured logging cho backend: severity, requestId, eventId, module, latency, errorCode.
- Error Reporting cho unhandled exception backend.
- Client error reporter chỉ gửi stack/error metadata đã lọc, không gửi frame hoặc landmarks.
- Log redaction cho token, email đầy đủ, text nhạy cảm và PII.
- Unit test, integration test và end-to-end test.
- Test camera trong ánh sáng ổn định, yếu, thay đổi, chuyển động nhẹ và mất mặt.
- Test trên ít nhất hai browser/device nếu có.
- rPPG feasibility report ghi rõ có hay không có ground truth.
- Privacy checklist và data retention note.

### Kỹ thuật sử dụng

- Firestore aggregation hoặc backend pre-aggregation.
- React chart library hiện có của nhóm.
- Cloud Logging, Error Reporting và Cloud Monitoring metrics cơ bản.
- Vitest/Jest, Testing Library và Playwright/Cypress.
- rPPG-Toolbox/rppg-pos chạy local cho report.

### Deliverables

- Caregiver analytics dashboard.
- Log dashboard/query mẫu.
- Test cases và bug list.
- Privacy checklist.
- rPPG feasibility report.
- Performance report cho Patient Web.

### Definition of Done

- [ ] Không có video/ảnh/landmarks/RGB raw trong log.
- [ ] Error Reporting nhóm được exception backend.
- [ ] Core flow có e2e test hoặc test script tái hiện được.
- [ ] Dashboard không diễn giải dữ liệu thành chẩn đoán y khoa.
- [ ] Bug critical và high được đóng trước Task 9.

---

## Task 9 — Integration, Production Deployment & Competition Demo

- **Phụ thuộc:** Task 1–Task 8.
- **Mục tiêu:** Có production link trên Google Cloud, demo end-to-end ổn định và tài liệu nộp bài hoàn chỉnh.

### Chức năng cần làm

- Merge tất cả module theo shared contract.
- Chạy luồng demo hoàn chỉnh:
  - caregiver đăng nhập và pair patient;
  - caregiver tùy chỉnh AAC;
  - Patient Web nhận board;
  - calibration gaze;
  - gaze dwell chọn item;
  - Gemini tạo câu;
  - TTS phát câu;
  - caregiver nhận communication event;
  - caregiver gửi reassurance;
  - Manual SOS gửi FCM;
  - caregiver acknowledgement;
  - dashboard cập nhật.
- Chạy smoke test sau mỗi deployment.
- Tối ưu bundle, camera FPS, worker và memory.
- Cấu hình production Firestore Rules, Storage Rules và CORS.
- Deploy frontend lên Firebase Hosting.
- Deploy backend lên Cloud Run.
- Lưu image trên Artifact Registry.
- Cấu hình environment/secrets bằng Google Cloud Secret Manager hoặc Cloud Run secrets.
- Kiểm tra Cloud Logging và Error Reporting trên production.
- Chuẩn bị demo account, demo board và fallback mode.
- Quay video demo và chụp ảnh bằng chứng production.
- Hoàn thiện README, technical note, privacy disclaimer và source links.
- Sau khi hoàn tất tích hợp, khóa phạm vi tính năng và chỉ sửa các lỗi nghiêm trọng ảnh hưởng đến luồng demo hoặc an toàn.

### Kỹ thuật sử dụng

- Firebase Hosting.
- Cloud Run.
- Artifact Registry.
- Cloud Build hoặc GitHub Actions.
- Secret Manager/Cloud Run secret mounting.
- Cloud Logging, Error Reporting và Cloud Monitoring.

### Deliverables

- Production URL.
- Backend Cloud Run URL.
- Demo account và demo data.
- Video demo.
- Final README và technical specification.
- Test report và known limitations.

### Definition of Done

- [ ] Production link mở được từ mạng ngoài.
- [ ] Không có secret trong client bundle hoặc repository.
- [ ] Manual SOS và caregiver acknowledgement chạy trên production.
- [ ] Gaze/AAC core chạy được trên thiết bị demo.
- [ ] Có fallback nếu Gemini, TTS hoặc rPPG lỗi.
- [ ] Cloud Logging nhận backend logs và không chứa raw biometric data.
- [ ] README ghi rõ rPPG experimental và OcuSpeak không phải thiết bị y tế.

---

## 10. Dependency summary

```text
Task 1 Foundation
  +--> Task 2 Patient AAC
  +--> Task 3 Camera AI
  +--> Task 4 Backend/Firebase

Task 2 + Task 4 --> Task 5 Caregiver App
Task 2 + Task 4 --> Task 6 Gemini/TTS
Task 3 + Task 4 + Task 5 --> Task 7 Safety/Notifications
Task 2..7 --> Task 8 Analytics/QA
Task 1..8 --> Task 9 Deploy/Demo
```

---

## 11. Shared event contracts

### Communication event

```json
{
  "eventId": "uuid",
  "schemaVersion": 1,
  "type": "AAC_SENTENCE_CONFIRMED",
  "patientId": "pseudonymous-id",
  "sessionId": "session-id",
  "itemIds": ["water", "mother"],
  "sentence": "Mẹ ơi, con muốn uống nước.",
  "occurredAt": "2026-08-03T09:30:00Z"
}
```

### Gaze status

```json
{
  "calibrationStatus": "READY",
  "trackingConfidence": 0.86,
  "validationErrorPx": 74,
  "validPointCount": 9,
  "timestamp": 1785740000000
}
```

### Safety event

```json
{
  "eventId": "device-session-window",
  "schemaVersion": 1,
  "type": "CHECK_REQUIRED",
  "severity": 2,
  "patientId": "pseudonymous-id",
  "configVersion": "remote-config-v3",
  "signals": {
    "facialState": "PROLONGED_EYE_CLOSURE",
    "facialConfidence": 0.89,
    "bpm": null,
    "rppgConfidence": 0.34,
    "cameraQuality": "LOW"
  },
  "reasonCodes": ["AAC_UNAVAILABLE", "RPPG_INSUFFICIENT"],
  "occurredAt": "2026-08-03T09:30:00Z"
}
```

---

## 12. Logging policy

### Được log

- Module name.
- Request/event ID.
- Schema/config version.
- Latency và status code.
- Error code và sanitized stack trace.
- Safety state và reason code dạng tổng hợp.
- Model/algorithm identifier.

### Không được log

- Video, frame, image hoặc image URL riêng tư không cần thiết.
- Face/eye crop.
- Landmarks đầy đủ.
- RGB signal.
- Firebase ID token, API key hoặc access token.
- Password.
- Full personal profile.
- Nội dung câu giao tiếp nhạy cảm trên production nếu không cần cho nghiệp vụ.

---

## 13. Repository và license risks

- WebGazer phải pin commit và kiểm tra trên browser mục tiêu.
- WebGazer và heartbeat-js có GPLv3; nhóm phải giữ license notice và đánh giá nghĩa vụ phân phối source.
- heartbeat-js chỉ là reference/prototype, không phải production library hoàn chỉnh.
- rPPG-Toolbox chỉ dùng offline; MVP browser chỉ giữ một thuật toán đã chọn.
- MediaPipe model/WASM phải bundle hoặc self-host nếu muốn tránh phụ thuộc CDN runtime.
- Không dùng `@latest` trong production dependency.

---

## 14. Final acceptance checklist

### Core communication

- [ ] Patient Web chạy bằng manual input ngay cả khi camera lỗi.
- [ ] Calibration 5/9 điểm chạy được.
- [ ] Gaze dwell chọn đúng AAC item khi confidence đạt.
- [ ] Gemini có structured output và fallback.
- [ ] TTS phát được câu hoặc có text fallback.

### Caregiver

- [ ] Pairing và authorization đúng.
- [ ] AAC customization đồng bộ thời gian thực.
- [ ] Reassurance command hoạt động.
- [ ] FCM notification và acknowledgement hoạt động.

### Safety

- [ ] Manual SOS luôn khả dụng.
- [ ] CHECK_REQUIRED không bị hiển thị như chẩn đoán.
- [ ] Automatic RED_ALERT có thể tắt.
- [ ] Duplicate event không tạo duplicate alert.
- [ ] rPPG trả null khi confidence thấp.

### Privacy và deployment

- [ ] Không upload raw camera data.
- [ ] Firestore/Storage Rules đã test.
- [ ] Production secrets không nằm trong repository/client bundle.
- [ ] Cloud Logging/Error Reporting hoạt động.
- [ ] Production URL trên Google Cloud/Firebase hoạt động ổn định và truy cập được từ mạng ngoài.

---

## 15. Official technical references

- OcuSpeak proposal: `Proposal Dự án OcuSpeak - AI Riser Vietnam 2026.pdf`.
- MediaPipe Face Landmarker for Web: https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js
- MediaPipe Image Segmenter for Web: https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter/web_js
- WebGazer: https://github.com/brownhci/WebGazer
- heartbeat-js: https://github.com/prouast/heartbeat-js
- POS reference: https://github.com/pavisj/rppg-pos
- rPPG-Toolbox: https://github.com/ubicomplab/rPPG-Toolbox
- Gemini structured output: https://ai.google.dev/gemini-api/docs/structured-output
- Firebase Remote Config: https://firebase.google.com/docs/remote-config
- Firebase Authentication: https://firebase.google.com/docs/auth/web/start
- Cloud Firestore Security: https://firebase.google.com/docs/firestore/security/overview
- Firebase Cloud Messaging for Web: https://firebase.google.com/docs/cloud-messaging/web/get-started
- Cloud Text-to-Speech: https://cloud.google.com/text-to-speech/docs
- Cloud Run logging: https://cloud.google.com/run/docs/logging
- Cloud Logging structured logs: https://cloud.google.com/logging/docs/structured-logging
- Error Reporting formatting: https://cloud.google.com/error-reporting/docs/formatting-error-messages

---

## 16. Source alignment note

- Task plan trong README này được xây dựng từ OcuSpeak proposal và technical specification đã sửa.
- File `TASK.xlsx` và `PROPOSAL.pdf` đang nằm trong bộ file hiện tại thuộc dự án Cemetery Management, không phải OcuSpeak; vì vậy README không sao chép nội dung task của hai file đó để tránh trộn hai dự án.
- Khi có task sheet OcuSpeak đúng, có thể ánh xạ các task trong README sang bảng quản lý riêng; phạm vi chức năng, dependency, technology và Definition of Done nên được giữ nguyên.
