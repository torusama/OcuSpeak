# OcuSpeak Frontend Implementation README

> Đặc tả đầy đủ cho phần Frontend của OcuSpeak, bao gồm kiến trúc giao diện, danh sách trang, chức năng từng trang, design system, trạng thái hệ thống, accessibility cho eye-gaze, component dùng chung, luồng dữ liệu, task triển khai và các prompt tham chiếu để tiếp tục dựng giao diện bằng React + TypeScript + Vite + Tailwind CSS.

## 0. Mục đích và cách dùng tài liệu

Tài liệu này là nguồn hướng dẫn chính cho đội Frontend. Khi code, thiết kế Figma, tạo component, viết test hoặc dùng công cụ sinh UI, phải bám theo thứ tự ưu tiên sau:

1. An toàn và khả năng giao tiếp của người dùng Patient Web.
2. Khả năng sử dụng bằng ánh mắt, không phụ thuộc chuột hoặc thao tác tay.
3. Manual SOS luôn hoạt động và luôn dễ truy cập.
4. Dữ liệu camera được xử lý tại thiết bị; Frontend không upload frame hoặc dữ liệu sinh trắc thô.
5. Giao diện người chăm sóc phải phân biệt rõ giao tiếp thường, trạng thái cần kiểm tra và cảnh báo khẩn cấp.
6. Giao diện dùng design system OcuSpeak trong tài liệu này, không sao chép logo, hình ảnh hoặc thương hiệu Duolingo.
7. Không dùng emoji trong giao diện. Khi cần biểu tượng, dùng icon nét đơn giản từ `lucide-react` hoặc icon SVG nội bộ.

Tài liệu tổng hợp phạm vi từ:

- Proposal OcuSpeak cho AI Riser Vietnam 2026.
- README kỹ thuật OcuSpeak.
- Bảng `TASK.xlsx` của dự án.
- Prompt style guide được cung cấp cho hướng thiết kế thân thiện, bo tròn, dễ đọc.
- Prompt linh vật/hero video được giữ lại ở phần phụ lục để dùng khi làm landing page hoặc nội dung quảng bá.

---

## 1. Bối cảnh sản phẩm và người dùng mục tiêu

OcuSpeak là nền tảng AAC bằng ánh mắt cho trẻ em và thanh thiếu niên khoảng 6-16 tuổi bị hạn chế vận động nặng và không thể giao tiếp rõ ràng bằng lời nói, nhưng còn khả năng nhìn, hiểu biểu tượng và chủ động điều khiển ánh mắt.

Frontend gồm hai sản phẩm chính:

- **OcuSpeak AAC - Patient Web:** giao diện toàn màn hình cho trẻ, ưu tiên các ô lớn, tương phản cao, gaze dwell, phản hồi trực quan và âm thanh.
- **OcuSpeak Care - Caregiver Web/PWA:** giao diện cho cha mẹ hoặc người chăm sóc, dùng để tạo hồ sơ, ghép nối thiết bị, chỉnh bảng AAC, nhận yêu cầu, phản hồi, xử lý cảnh báo và xem lịch sử.

MVP chỉ phục vụ mô hình gia đình một người bệnh - một người giám hộ chính. Không thiết kế giao diện bệnh viện nhiều bệnh nhân, nhiều y tá hoặc điều phối tài nguyên trong giai đoạn này.

---

## 2. Phạm vi Frontend bắt buộc

### 2.1 Patient Web

Patient Web phải có các nhóm chức năng sau:

- Ghép nối với hồ sơ trẻ bằng mã hoặc QR.
- Xin quyền camera và âm thanh.
- Hướng dẫn đặt thiết bị ngang tầm mắt.
- Calibration 5 điểm hoặc 9 điểm.
- Hiển thị kết quả calibration và hướng dẫn làm lại khi cần.
- AAC Grid 4, 6 hoặc 9 ô.
- Chuyển danh mục và chuyển trang item bằng gaze.
- Highlight ô đang được nhìn và hiển thị Dwell Progress.
- Chọn item bằng dwell click có hysteresis, cooldown và chống chọn lặp.
- Sentence Composer và câu mẫu nhanh.
- Gemini sentence generation có fallback.
- TTS và text fallback.
- Hiển thị trạng thái yêu cầu: đã gửi, đã nhận, đang xử lý, đã hoàn thành.
- Hiển thị phản hồi trấn an từ caregiver.
- Manual SOS luôn hiển thị.
- Hiển thị trạng thái camera, gaze, mạng và monitoring ở mức dễ hiểu.
- Offline fallback board cho các nhu cầu thiết yếu.

### 2.2 Caregiver Web/PWA

Caregiver Web/PWA phải có:

- Đăng nhập bằng Firebase Authentication.
- Tạo và quản lý hồ sơ trẻ.
- Pairing bằng mã hoặc QR.
- Dashboard trạng thái thiết bị, camera, tracking, monitoring và cảnh báo.
- Inbox yêu cầu giao tiếp theo thời gian thực.
- Cập nhật trạng thái xử lý yêu cầu.
- Gửi lời trấn an bằng câu mẫu, câu tùy chỉnh hoặc file giọng nói.
- AAC Board Editor: thêm, sửa, xóa, ẩn, sắp xếp category/item.
- Upload ảnh vật dụng quen thuộc.
- Chọn grid 4/6/9, dwell time, loại hình ảnh và phản hồi.
- Quản lý preset theo thời điểm hoặc tình huống.
- Nhận push notification.
- Màn hình SOS toàn màn hình và acknowledgement.
- Lịch sử giao tiếp, cảnh báo và phản hồi.
- Dashboard phân tích đơn giản, không diễn giải thành chẩn đoán y khoa.
- PWA Manifest, Add to Home Screen, offline/reconnect và notification permission.

### 2.3 Public/Demo Pages

Để phục vụ bài thi và production link, cần thêm:

- Landing page giới thiệu dự án.
- Trang hướng dẫn trải nghiệm demo.
- Trang privacy và camera data boundary.
- Trang yêu cầu thiết bị/trình duyệt.
- Trang lỗi hoặc browser không hỗ trợ.

---

## 3. Nguyên tắc thiết kế chính

### 3.1 Tinh thần hình ảnh

Thiết kế chính lấy cảm hứng từ phong cách học tập thân thiện, tròn, rõ ràng và có cảm giác vật lý nhẹ ở button/card, nhưng phải là nhận diện riêng của OcuSpeak.

Đặc điểm cần giữ:

- Font tròn, thân thiện, dễ đọc.
- Heading có cá tính nhưng không gây khó đọc.
- Button lớn, có viền hoặc shadow 3D nhẹ.
- Card bo tròn, nội dung phân cấp rõ.
- Màu sắc vui nhưng không quá chói trên Patient Web.
- Nhiều khoảng trắng.
- Label ngắn, dùng từ quen thuộc.
- Không đặt thông tin quan trọng chỉ bằng màu; luôn có label và icon.
- Không dùng emoji cho trạng thái, cảnh báo hoặc navigation.
- Không phụ thuộc hover vì Patient Web được điều khiển bằng gaze.

### 3.2 Tách phong cách theo sản phẩm

**Patient Web**

- Tối giản hơn Caregiver Web.
- Fullscreen, không sidebar.
- Mỗi thời điểm chỉ hiển thị những gì trẻ cần quyết định.
- Mục tiêu gaze có kích thước lớn và khoảng cách an toàn.
- Giảm text dài.
- Không dùng bảng dữ liệu phức tạp.
- Motion ngắn và có thể tắt.

**Caregiver Web/PWA**

- Có navigation rõ ràng.
- Dùng card, list, filter và form.
- Có thể hiển thị nhiều thông tin hơn nhưng không được dày đặc.
- Cảnh báo khẩn cấp phải khác hoàn toàn notification thường.

**Landing/Marketing**

- Có thể dùng mascot, video background hoặc layout sáng tạo hơn.
- Không được để phong cách marketing ảnh hưởng đến khả năng đọc của Patient Web.

---

## 4. Typography

### 4.1 Font chính

- **Primary/body font:** `Nunito` từ Google Fonts.
- **Display/heading font:** `Feather Bold`.
- **Fallback:** `'Nunito', 'DIN Round Pro', -apple-system, BlinkMacSystemFont, sans-serif`.

Load Nunito trong `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
  rel="stylesheet"
/>
<link
  href="https://db.onlinewebfonts.com/c/14936bb7a4b6575fd2eee80a3ab52cc2?family=Feather+Bold"
  rel="stylesheet"
/>
```

Tailwind config:

```ts
fontFamily: {
  sans: ['Nunito', 'DIN Round Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  display: ['Feather Bold', 'Nunito', 'sans-serif'],
}
```

### 4.2 Quy tắc sử dụng font

| Token | Font | Kích thước đề xuất | Weight | Dùng cho |
|---|---|---:|---:|---|
| Display XL | Feather Bold | 48-64px | normal | Landing hero, tên sản phẩm |
| Display | Feather Bold | 36-48px | normal | Tiêu đề màn hình Patient |
| H1 | Nunito | 30-36px | 900 | Tiêu đề trang Caregiver |
| H2 | Nunito | 24-28px | 800 | Tiêu đề section |
| H3 | Nunito | 18-22px | 800 | Card title |
| Body Large | Nunito | 18-22px | 700 | Label AAC, instruction Patient |
| Body | Nunito | 15-17px | 500-600 | Nội dung Caregiver |
| Caption | Nunito | 12-14px | 700-800 | Badge, metadata |

Không dùng Feather Bold cho paragraph, form, chart label hoặc cảnh báo dài.

---

## 5. OcuSpeak Color Palette

Palette chính phải sử dụng tám màu từ ảnh tham chiếu:

| Tên token | Hex | Vai trò chính |
|---|---|---|
| Ocu Red | `#CC1400` | SOS, danger, lỗi nghiêm trọng |
| Ocu Orange | `#FFAD33` | warning, đang chờ, cần chú ý |
| Ocu Yellow | `#FFEC89` | highlight nhẹ, dwell progress background |
| Ocu Green | `#6BAA75` | success, online, completed |
| Ocu Pink | `#C28CAE` | caregiver reassurance, cảm xúc |
| Ocu Purple | `#967CC7` | AI/Gemini, preset, secondary accent |
| Ocu Indigo | `#4C57A9` | primary brand, navigation, main CTA |
| Ocu Blue | `#6698CC` | information, tracking, links |

### 5.1 Neutral tokens

Các neutral sau được bổ sung để giao diện đọc được và vẫn giữ tinh thần palette:

```css
:root {
  --ocu-red: #cc1400;
  --ocu-orange: #ffad33;
  --ocu-yellow: #ffec89;
  --ocu-green: #6baa75;
  --ocu-pink: #c28cae;
  --ocu-purple: #967cc7;
  --ocu-indigo: #4c57a9;
  --ocu-blue: #6698cc;

  --canvas: #f8f5ec;
  --surface: #ffffff;
  --surface-soft: #f3f0e8;
  --ink: #28305f;
  --text: #434967;
  --text-muted: #737993;
  --border: #e4e1d8;
  --disabled: #c8c8d2;

  --primary-hover: #414b94;
  --primary-shadow: #39427f;
  --danger-hover: #ad1100;
  --danger-shadow: #8f0e00;
  --info-hover: #5686b7;
  --success-strong: #4f875a;
  --purple-strong: #755ca8;
}
```

### 5.2 Quy tắc tương phản

- `#4C57A9` và `#CC1400` có thể dùng với chữ trắng.
- `#FFAD33`, `#FFEC89`, `#6BAA75`, `#C28CAE` và `#6698CC` nên dùng chữ `#28305F` cho nội dung nhỏ.
- `#967CC7` chỉ dùng chữ trắng cho heading/button lớn; nội dung nhỏ phải dùng `--purple-strong` hoặc chữ `--ink`.
- Không dùng màu nhạt làm text trên nền trắng.
- Cảnh báo không chỉ dựa vào màu đỏ; phải có icon `TriangleAlert`, heading và lý do.

### 5.3 Tailwind theme đề xuất

```ts
colors: {
  ocu: {
    red: '#CC1400',
    orange: '#FFAD33',
    yellow: '#FFEC89',
    green: '#6BAA75',
    pink: '#C28CAE',
    purple: '#967CC7',
    indigo: '#4C57A9',
    blue: '#6698CC',
    canvas: '#F8F5EC',
    surface: '#FFFFFF',
    soft: '#F3F0E8',
    ink: '#28305F',
    text: '#434967',
    muted: '#737993',
    border: '#E4E1D8',
  },
}
```

---

## 6. Shape, spacing, border và elevation

### 6.1 Radius

- AAC item: `24px` trên laptop, `20px` trên tablet.
- Primary card: `20px`.
- Button lớn: `16px`.
- Input: `14px`.
- Badge: `9999px` hoặc `10px` tùy loại.
- Modal: `24px`.

### 6.2 Border

- Card thường: `2px solid var(--border)`.
- Gaze target đang focus: `4px solid var(--ocu-indigo)`.
- Success: `3px solid var(--ocu-green)`.
- Alert: `3px solid var(--ocu-red)`.
- Không dùng border dưới 2px cho mục tiêu gaze.

### 6.3 Shadow 3D

Primary button:

```css
box-shadow: 0 4px 0 var(--primary-shadow);
```

Danger button:

```css
box-shadow: 0 4px 0 var(--danger-shadow);
```

Secondary button:

```css
box-shadow: 0 4px 0 #cfcdd0;
```

Khi active bằng click/touch:

```css
transform: translateY(4px);
box-shadow: none;
```

Patient Web không dùng hiệu ứng nhảy vị trí khi gaze focus. Focus chỉ đổi viền, nền hoặc progress ring để không làm mục tiêu di chuyển dưới ánh mắt.

### 6.4 Spacing

Dùng scale 4px:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

Khoảng cách tối thiểu giữa hai gaze target:

- Grid 4 ô: 24-32px.
- Grid 6/9 ô: 16-24px.
- Arrow chuyển trang và AAC card: tối thiểu 20px.

---

## 7. Motion, audio và feedback

### 7.1 Motion

- Không dùng animation liên tục trên AAC Grid.
- Dwell progress là motion chính.
- Selection success: scale nhẹ hoặc pulse một lần trong 150-250ms.
- Reassurance overlay: fade/slide ngắn 200-300ms.
- Alert khẩn cấp có thể pulse border nhưng phải tôn trọng `prefers-reduced-motion`.
- Không dùng parallax, floating object hoặc carousel tự chạy trong Patient Web.

### 7.2 Audio

- Selection success có âm thanh ngắn, có thể tắt.
- Câu giao tiếp dùng Google TTS hoặc text fallback.
- Reassurance có thể phát TTS hoặc file caregiver ghi âm.
- SOS caregiver có âm thanh rõ ràng; Patient Web chỉ phát âm xác nhận ngắn, không gây hoảng loạn.

### 7.3 Feedback gaze

Mỗi gaze target có các trạng thái:

```text
IDLE -> FOCUSED -> DWELLING -> SELECTED -> COOLDOWN -> IDLE
```

- `FOCUSED`: border indigo, không đổi vị trí.
- `DWELLING`: progress ring hoặc progress bar.
- `SELECTED`: check icon và feedback ngắn.
- `COOLDOWN`: tạm khóa để tránh chọn lặp.
- Khi confidence thấp hoặc mất face, chuyển về `IDLE`, reset dwell.

---

## 8. Iconography

Dùng `lucide-react`. Không dùng emoji.

Bộ icon tối thiểu:

| Chức năng | Icon gợi ý |
|---|---|
| Camera | `Camera` |
| Gaze/eye tracking | `Eye` |
| Calibration | `ScanFace` hoặc `Focus` |
| AAC board | `Grid2X2` |
| Chuyển trang dưới | `ChevronDown` |
| Chuyển trang trên | `ChevronUp` |
| Back | `ArrowLeft` |
| TTS | `Volume2` |
| Microphone | `Mic` |
| Upload image | `ImagePlus` |
| Caregiver | `UserRound` |
| Notification | `Bell` |
| SOS | `TriangleAlert` |
| Monitoring | `HeartPulse` |
| Online | `Wifi` |
| Offline | `WifiOff` |
| Success | `Check` |
| Close/Delete | `X` hoặc `Trash2` |
| Settings | `Settings` |
| History | `History` |
| Analytics | `ChartNoAxesCombined` |

Icon trong AAC item chỉ là phụ trợ. Ảnh hoặc biểu tượng nhu cầu phải lớn hơn icon chức năng.

---

## 9. Accessibility và gaze-first constraints

### 9.1 Mục tiêu gaze

- Kích thước tối thiểu 120x120px trên màn hình laptop tiêu chuẩn.
- Grid 4 ô là mặc định an toàn nhất.
- Grid 6/9 chỉ bật khi calibration và validation cho thấy đủ chính xác.
- Không đặt hai hành động nguy hiểm cạnh nhau.
- SOS phải cách xa arrow chuyển trang và nút xóa.
- Không đặt CTA ở góc sát mép màn hình nếu camera mapping có sai số cao.

### 9.2 Dwell

- Dwell time hỗ trợ 1s, 1.5s, 2s, 3s.
- Mặc định 1.5-2s.
- Có dwell progress rõ ràng.
- Hysteresis để ánh mắt rung nhẹ không reset ngay.
- Nếu gaze nằm giữa hai ô, không chọn ô nào.
- Khi chuyển từ item sang arrow, cần khoảng trễ ngắn để tránh scroll ngoài ý muốn.

### 9.3 Trường hợp người dùng đeo kính hoặc thị lực hạn chế

- Không kết luận đeo kính là không dùng được.
- Calibration phải thực hiện trong điều kiện sử dụng thật, bao gồm kính thường ngày.
- Camera setup hiển thị cảnh báo phản chiếu kính khi confidence giảm.
- Cho phép đổi vị trí thiết bị/ánh sáng rồi calibration lại.
- Tăng kích thước item, giảm số ô từ 9 xuống 6 hoặc 4.
- Cho phép dùng ảnh thật có độ tương phản cao.
- Cho phép tăng border focus và giảm chi tiết nền.
- Nếu thị lực hạn chế nặng hoặc không thể chủ động điều hướng ánh mắt, hệ thống phải báo không phù hợp thay vì cố tiếp tục calibration.

### 9.4 Keyboard, touch và caregiver override

- Mọi chức năng Patient Web vẫn hỗ trợ keyboard/touch để demo và caregiver can thiệp.
- Tab order logic.
- Enter/Space kích hoạt button.
- Escape đóng modal không khẩn cấp.
- Manual SOS không bị vô hiệu hóa bởi modal, loading hoặc gaze error.

### 9.5 Text và ngôn ngữ

- Patient labels tối đa 1-3 từ.
- Dùng tiếng Việt đơn giản.
- Không dùng thuật ngữ như `tracking confidence` ở màn hình trẻ; thay bằng `Camera đang ổn`, `Cần chỉnh camera`.
- Caregiver UI có thể hiển thị thuật ngữ kỹ thuật và tooltip giải thích.

---

## 10. Kiến trúc Frontend đề xuất

### 10.1 Stack

- React + TypeScript + Vite.
- Tailwind CSS.
- React Router.
- Zustand cho session/UI/camera state cục bộ.
- TanStack Query cho API state và retry.
- Firebase Web SDK cho Authentication, Firestore realtime, Storage và FCM.
- React Hook Form + Zod cho form.
- `lucide-react` cho icon.
- Vitest + Testing Library.
- Playwright cho end-to-end.
- PWA plugin cho Caregiver Web/PWA.

### 10.2 Cấu trúc thư mục

```text
src/
  app/
    router/
    providers/
    config/
  assets/
    brand/
    icons/
    aac-default/
  components/
    ui/
    feedback/
    layout/
    gaze/
    aac/
    caregiver/
    monitoring/
    alerts/
  features/
    auth/
    pairing/
    patient-setup/
    calibration/
    gaze-session/
    aac-board/
    communication/
    reassurance/
    safety/
    analytics/
    notifications/
    settings/
  pages/
    public/
    patient/
    caregiver/
  services/
    api/
    firebase/
    realtime/
    tts/
    media/
  stores/
  hooks/
  types/
  utils/
  workers/
```

### 10.3 Nguyên tắc state

- Camera frame và raw landmarks không đưa vào global store.
- Global store chỉ giữ state đã chuẩn hóa: gaze point, confidence, camera quality, dwell state.
- Firestore realtime listener phải được unsubscribe khi đổi patient hoặc unmount.
- Board update từ caregiver không được thay đổi layout giữa lúc patient đang dwelling; áp dụng ở safe checkpoint sau selection hoặc khi gaze rời tất cả target.
- Event gửi backend phải có `eventId` để chống trùng.

---

## 11. Route map tổng thể

### 11.1 Public routes

| Route | Trang | Mức ưu tiên | Chức năng |
|---|---|---:|---|
| `/` | Landing | P1 | Giới thiệu OcuSpeak, CTA mở Patient/Caregiver demo |
| `/demo` | Demo Guide | P1 | Hướng dẫn luồng trải nghiệm cho ban giám khảo |
| `/requirements` | Device Requirements | P1 | Camera, browser, HTTPS, quyền âm thanh |
| `/privacy` | Privacy | P0 | Giải thích dữ liệu camera xử lý local và dữ liệu được gửi |
| `/unsupported` | Unsupported Browser | P0 | Hướng dẫn khi browser/device không hỗ trợ |

### 11.2 Patient routes

| Route | Trang | Mức ưu tiên | Chức năng |
|---|---|---:|---|
| `/patient/connect` | Pairing | P0 | Nhập mã hoặc quét QR để liên kết hồ sơ |
| `/patient/permissions` | Permissions | P0 | Xin quyền camera, audio và kiểm tra HTTPS |
| `/patient/device-setup` | Camera Setup | P0 | Hướng dẫn vị trí máy, ánh sáng, khoảng cách |
| `/patient/calibration` | Calibration | P0 | Chạy 5/9 điểm, thu sample hợp lệ |
| `/patient/calibration/result` | Calibration Result | P0 | Tốt, cần làm lại, không nhận diện được |
| `/patient/aac` | AAC Category Board | P0 | Grid danh mục chính |
| `/patient/aac/:categoryId` | AAC Item Board | P0 | Grid item chi tiết, paging bằng gaze |
| `/patient/compose` | Sentence Composer | P0 | Xem item đã chọn, phát, xác nhận, xóa |
| `/patient/request/:eventId` | Request Status | P0 | Sent, received, processing, completed |
| `/patient/reassurance` | Reassurance Overlay | P0 | Hiển thị/phát phản hồi caregiver |
| `/patient/sos` | SOS State | P0 | Confirm/active/acknowledged/resolved |
| `/patient/check-required` | Check Required | P0 | Camera/face/gaze/monitoring cần caregiver kiểm tra |
| `/patient/offline` | Offline Fallback | P0 | Essential board local và queue sự kiện |

### 11.3 Caregiver routes

| Route | Trang | Mức ưu tiên | Chức năng |
|---|---|---:|---|
| `/care/login` | Login | P0 | Firebase Authentication |
| `/care/onboarding` | Create Profile | P0 | Tạo caregiver và child profile |
| `/care/pair` | Pair Device | P0 | Tạo mã/QR, expiry và trạng thái kết nối |
| `/care/dashboard` | Dashboard | P0 | Online, tracking, monitoring, latest request, alert |
| `/care/patient/:patientId` | Patient Overview | P0 | Hồ sơ, cấu hình, thiết bị, trạng thái |
| `/care/communications` | Communication Inbox | P0 | Danh sách yêu cầu realtime |
| `/care/communications/:eventId` | Communication Detail | P0 | Nội dung, timeline, trạng thái, reassurance |
| `/care/alerts` | Alert Inbox | P0 | CHECK_REQUIRED và RED_ALERT |
| `/care/alerts/:alertId` | Alert Detail | P0 | Reason codes, acknowledgement, lifecycle |
| `/care/aac` | AAC Board Manager | P0 | Category, item, order, visibility |
| `/care/aac/category/:categoryId` | Category Editor | P0 | Chỉnh item trong category |
| `/care/aac/item/new` | New AAC Item | P0 | Tạo item, ảnh, label, speech text |
| `/care/aac/item/:itemId/edit` | Edit AAC Item | P0 | Sửa/xóa/ẩn item |
| `/care/presets` | AAC Presets | P1 | Sáng/trưa/tối hoặc tình huống |
| `/care/reassurance` | Reassurance Library | P1 | Câu mẫu, câu tùy chỉnh, audio |
| `/care/history` | Care Log | P1 | Lịch sử giao tiếp, phản hồi, cảnh báo |
| `/care/analytics` | Analytics | P1 | Xu hướng sử dụng và response time |
| `/care/settings` | Settings | P0 | Grid, dwell, TTS, feedback, flags |
| `/care/devices` | Device Management | P1 | Online/offline, last seen, unpair |
| `/care/notifications` | Notification Settings | P1 | FCM permission, alert sound, test notification |

---

# 12. Chi tiết từng trang Public

## 12.1 Landing Page - `/`

### Mục tiêu

Giới thiệu ngắn gọn OcuSpeak và cho phép ban giám khảo hoặc tester đi đúng luồng.

### Bố cục

- Navbar 64px.
- OcuSpeak wordmark bên trái.
- Nav: Giải pháp, Cách hoạt động, An toàn dữ liệu, Trải nghiệm.
- Hero với heading Feather Bold.
- Hai CTA: `Mở Patient Demo` và `Mở Caregiver Demo`.
- Section mô tả ba bước: setup, giao tiếp bằng mắt, caregiver phản hồi.
- Section privacy boundary.
- Section limitation: không phải thiết bị y tế.
- Footer với link privacy, technical note và demo guide.

### Trạng thái

- CTA Patient kiểm tra HTTPS và camera support trước khi đi tiếp.
- CTA Caregiver đi login.
- Nếu production backend lỗi, hiển thị banner `Dịch vụ demo đang tạm gián đoạn`.

### Acceptance

- Có thể mở từ cửa sổ ẩn danh.
- Không yêu cầu camera ngay trên landing.
- Không dùng video hoặc animation nặng trên thiết bị yếu.

## 12.2 Demo Guide - `/demo`

- Hiển thị luồng demo end-to-end.
- Có hai cột Patient và Caregiver.
- Cung cấp demo account theo cơ chế an toàn, không hard-code password trong client bundle.
- Hiển thị checklist quyền camera/notification.
- Có link reset demo data nếu backend hỗ trợ.
- Có fallback scenario khi rPPG hoặc Gemini bị tắt.

## 12.3 Device Requirements - `/requirements`

- Browser hỗ trợ camera, WebAssembly và `getUserMedia`.
- Yêu cầu HTTPS.
- Thiết bị đặt ngang tầm mắt.
- Khoảng cách gợi ý và ánh sáng ổn định.
- Hướng dẫn tránh phản chiếu mạnh trên kính.
- Button `Kiểm tra thiết bị` chạy capability check.

## 12.4 Privacy - `/privacy`

Phải ghi rõ:

- Camera xử lý tại thiết bị.
- Không upload video, frame, screenshot, eye crop hoặc face crop.
- Không upload landmarks đầy đủ hoặc RGB rPPG thô.
- Backend chỉ nhận event chuẩn hóa, confidence, reason code và timestamp.
- Gemini/TTS chỉ nhận text/event cần thiết.
- rPPG là thử nghiệm và không thay thế thiết bị y tế.

## 12.5 Unsupported Browser - `/unsupported`

- Nêu capability thiếu.
- Hướng dẫn dùng browser hỗ trợ.
- Không tự động redirect vòng lặp.
- Có button quay về landing.

---

# 13. Chi tiết từng trang Patient Web

## 13.1 Pairing - `/patient/connect`

### Mục tiêu

Liên kết Patient Web với child profile đã được caregiver tạo.

### UI

- Wordmark nhỏ.
- Heading `Kết nối thiết bị`.
- Input mã 6 ký tự hoặc QR scanner tùy thiết bị.
- Trạng thái mã: hợp lệ, hết hạn, đã dùng, không đúng.
- Tên hồ sơ sau khi xác minh.
- Button `Kết nối`.

### Chức năng

- Verify code qua backend.
- Lưu device session an toàn.
- Không hiển thị thông tin nhạy cảm trước khi code hợp lệ.
- Có timeout và retry.

### Edge cases

- Mã hết hạn: hướng dẫn caregiver tạo mã mới.
- Thiết bị đã pair hồ sơ khác: yêu cầu unpair có xác nhận.
- Offline: không cho pairing mới, nhưng phiên đã pair trước đó có thể dùng fallback.

## 13.2 Permissions - `/patient/permissions`

### UI

Ba permission card:

- Camera.
- Âm thanh phát ra.
- Microphone chỉ khi cần kiểm thử hoặc caregiver audio; không bắt buộc cho AAC cơ bản.

### Chức năng

- Gọi `getUserMedia` đúng lúc người dùng bấm cho phép.
- Hiển thị preview local nhỏ cho caregiver setup.
- Không upload preview.
- Cho phép tiếp tục với manual mode nếu camera bị từ chối.

### Acceptance

- Camera denial không làm app crash.
- Manual SOS và manual AAC vẫn vào được.

## 13.3 Device Setup - `/patient/device-setup`

### UI

- Hình minh họa vị trí mặt trong oval guide.
- Camera preview local.
- Chỉ báo: đủ sáng, mặt ở giữa, khoảng cách phù hợp, camera ổn định.
- Button `Bắt đầu calibration`.

### Chức năng

- Nhận camera quality state từ AI Engine.
- Không hiển thị raw metric phức tạp cho trẻ.
- Có hướng dẫn riêng khi đeo kính bị glare.

### Trạng thái

- `READY`: đủ điều kiện.
- `MOVE_CLOSER` / `MOVE_BACK`.
- `CENTER_FACE`.
- `LOW_LIGHT`.
- `GLARE_OR_OVEREXPOSURE`.
- `FACE_NOT_FOUND`.

## 13.4 Calibration - `/patient/calibration`

### UI

- Fullscreen.
- Một calibration point tại mỗi thời điểm.
- Progress `3/5` hoặc `6/9`.
- Nút caregiver `Tạm dừng`, `Làm lại`, `Thoát manual mode` nằm xa gaze point.
- Camera status chip nhỏ.

### Chức năng

- Hỗ trợ 5 điểm và 9 điểm.
- Thu nhiều sample mỗi điểm.
- Chỉ nhận sample khi face visibility, gaze feature và confidence đạt.
- Reset point nếu di chuyển đầu quá nhiều.
- Không dùng motion nhanh.

### Edge cases

- Mất face: pause, không chuyển điểm.
- Kính phản chiếu: hiển thị hướng dẫn điều chỉnh ánh sáng.
- User không nhìn được điểm góc: cho phép quay về grid 4 ô hoặc manual mode.
- Timeout: không đánh dấu thất bại y tế; chỉ nói `Không đủ dữ liệu để hoàn tất`.

## 13.5 Calibration Result - `/patient/calibration/result`

### Kết quả

- `Tốt`: tiếp tục AAC.
- `Có thể dùng, nên chọn 4 ô`: validation error trung bình.
- `Cần thực hiện lại`: error cao hoặc point thiếu.
- `Không nhận diện được`: face/eye feature không ổn định.

### UI

- Kết quả bằng màu + icon + câu giải thích.
- Không hiển thị số px cho trẻ; caregiver có thể mở `Chi tiết kỹ thuật`.
- CTA `Vào bảng giao tiếp`, `Làm lại`, `Dùng điều khiển tay`.

## 13.6 AAC Category Board - `/patient/aac`

### Mục tiêu

Hiển thị nhóm chính để giảm tải nhận thức.

### Category mặc định

- Nhu cầu.
- Cảm xúc.
- Người thân.
- Hoạt động.

Có thể mở rộng bằng caregiver nhưng màn hình mặc định ưu tiên 4 category.

### Layout

- Grid 2x2 toàn màn hình.
- Mỗi card có ảnh/icon lớn, label 1-2 từ.
- Thanh trạng thái mỏng ở trên: camera, connection, caregiver status.
- Manual SOS cố định ở góc an toàn, không trùng gaze target thường.
- Composer mini bar chỉ xuất hiện khi đã có item được chọn.

### Gaze behavior

- Highlight card khi focus.
- Dwell ring chạy quanh card.
- Khi chọn category, chuyển trang bằng fade ngắn.
- Không tự động chọn nếu gaze đi ngang qua card.

## 13.7 AAC Item Board - `/patient/aac/:categoryId`

### Mục tiêu

Hiển thị item chi tiết trong category nhưng vẫn giữ số target ít và ổn định.

### Layout mặc định được ưu tiên

- Luôn ưu tiên **4 item chính** theo dạng 2x2.
- Nếu category có hơn 4 item, hiển thị một **nút mũi tên hướng xuống** ở vùng riêng phía dưới.
- Nhìn vào arrow đủ dwell time sẽ chuyển sang nhóm 4 item tiếp theo.
- Có arrow hướng lên hoặc back để quay về nhóm trước.
- Arrow không được làm grid nhảy vị trí; bốn ô giữ nguyên tọa độ giữa các trang.
- Có indicator `1/3`, nhưng không dùng dot quá nhỏ.

### Lý do dùng paging thay vì scroll liên tục

- Mục tiêu gaze giữ vị trí ổn định.
- Tránh scroll ngoài ý muốn.
- Giảm số lựa chọn trên màn hình.
- Xử lý edge case khi 4 item hiện tại không có nhu cầu trẻ muốn.

### Chức năng

- Item gồm ảnh/icon, label, speech text.
- Dwell chọn item.
- Có cooldown sau selection.
- Có thể chuyển nhanh sang composer hoặc tiếp tục chọn nhiều item.
- Back về category bằng target lớn.

### Edge cases

- Item bị caregiver xóa trong lúc đang dwell: hoãn cập nhật đến safe checkpoint.
- Ảnh tải lỗi: dùng placeholder icon và label.
- Không có item: hiển thị `Chưa có lựa chọn` và target quay lại.
- Board update realtime: hiển thị unobtrusive status, không reload toàn trang.

## 13.8 Sentence Composer - `/patient/compose`

### UI

- Dãy item đã chọn theo thứ tự.
- Câu mẫu hoặc câu Gemini.
- Button gaze lớn: `Phát`, `Gửi`, `Xóa cuối`, `Xóa hết`, `Quay lại`.
- Trạng thái `Đang tạo câu` không khóa Manual SOS.

### Chức năng

- Chế độ nhanh: map item thành câu mẫu không cần Gemini.
- Chế độ thông minh: gửi item IDs/labels và context không nhạy cảm lên backend.
- Gemini chỉ làm câu tự nhiên hơn.
- Validate structured output.
- Timeout dùng deterministic fallback.
- Người dùng hoặc caregiver phải xác nhận câu trước khi lưu như communication message.

### Edge cases

- Gemini lỗi: hiển thị câu fallback ngay.
- TTS lỗi: giữ text và cho thử phát lại.
- Không có item: không cho gửi.
- Câu dài: giới hạn dòng và cỡ chữ tự co trong phạm vi cho phép.

## 13.9 Request Status - `/patient/request/:eventId`

### Timeline

```text
Đã gửi -> Đã nhận -> Đang xử lý -> Đã hoàn thành
```

### UI

- Một status card lớn.
- Câu đã gửi.
- Caregiver name/avatar nếu được phép.
- Thời gian cập nhật gần nhất.
- Button `Phát lại câu`.
- Button `Gửi lại` chỉ xuất hiện khi backend xác định gửi thất bại.

### Realtime

- Firestore listener hoặc realtime client.
- Update idempotent.
- Không tạo toast lặp khi reconnect.

## 13.10 Reassurance Overlay - `/patient/reassurance`

### Nội dung hỗ trợ

- Câu mẫu: `Mẹ đã nhận`, `Mẹ đang đến`, `Chờ mẹ một chút`.
- Câu tùy chỉnh caregiver đã xác nhận.
- Ảnh hoặc dấu tích.
- TTS hoặc audio ghi sẵn.

### UI

- Overlay lớn nhưng không che SOS.
- Có auto-dismiss theo cấu hình và target `Đóng` lớn.
- Không hiển thị autoplay video.

## 13.11 SOS State - `/patient/sos`

### Luồng

- Manual SOS target luôn có trên AAC screen.
- Dwell đủ thời gian mở confirm screen hoặc kích hoạt trực tiếp tùy cấu hình an toàn.
- Sau khi kích hoạt, event tạo `RED_ALERT` ngay.
- Hiển thị các trạng thái: `Đã gửi cảnh báo`, `Người chăm sóc đã nhận`, `Đang kiểm tra`, `Đã xử lý`.

### UI

- Màu đỏ `#CC1400` với chữ trắng.
- Icon `TriangleAlert`.
- Không dùng flashing mạnh.
- Không để button hủy quá gần vùng kích hoạt.

### Bắt buộc

- Hoạt động khi camera tắt.
- Hoạt động khi Gemini/TTS lỗi.
- Không bị modal khác che.
- Không gửi trùng khi dwell kéo dài.

## 13.12 Check Required - `/patient/check-required`

### Trigger

- Face not found kéo dài.
- Camera bị che.
- Ánh sáng kém.
- Tracking confidence thấp.
- AAC không sử dụng được.
- Monitoring confidence không đủ.

### UI

- Dùng orange/yellow, không dùng red nếu chưa phải khẩn cấp.
- Nội dung đơn giản: `Cần người chăm sóc kiểm tra camera`.
- Không hiển thị như chẩn đoán.
- Manual SOS vẫn có.

## 13.13 Offline Fallback - `/patient/offline`

### Board local tối thiểu

- Uống nước.
- Đói.
- Đau/khó chịu.
- Gọi người thân.
- Manual SOS.

### Chức năng

- Lưu communication event vào queue cục bộ.
- Retry khi có mạng.
- Event ID cố định để không gửi trùng.
- Hiển thị rõ `Chưa gửi được`.
- TTS local/browser có thể dùng nếu cloud TTS không hoạt động.

---

# 14. Chi tiết từng trang Caregiver Web/PWA

## 14.1 Login - `/care/login`

- Email/password hoặc provider được đội chọn.
- Firebase Authentication.
- Forgot password.
- Loading, invalid credential, network error.
- Không hiển thị lỗi kỹ thuật dài.
- Sau login redirect về dashboard hoặc onboarding.

## 14.2 Onboarding - `/care/onboarding`

### Các bước

1. Thông tin caregiver.
2. Tạo child profile.
3. Chọn grid mặc định.
4. Chọn dwell time.
5. Chọn phản hồi âm thanh.
6. Pair thiết bị.

### Child profile

- Tên hiển thị.
- Tuổi.
- Ảnh đại diện tùy chọn.
- Grid 4/6/9.
- Dwell 1/1.5/2/3 giây.
- Icon hoặc ảnh thật.
- TTS on/off.

Không thu thập dữ liệu y tế chi tiết ngoài phạm vi cần thiết của MVP.

## 14.3 Pair Device - `/care/pair`

- Tạo code và QR có expiry.
- Countdown expiry.
- Trạng thái waiting/connected/expired.
- Tên device và last seen sau khi pair.
- Button regenerate.
- Không hiển thị code vĩnh viễn.

## 14.4 Dashboard - `/care/dashboard`

### Bố cục desktop

- Sidebar navigation.
- Header: patient selector, notification, profile.
- Hàng KPI/card trạng thái:
  - Patient online/offline.
  - Camera quality.
  - Gaze tracking.
  - Monitoring quality.
  - Alert state.
- Latest communication request.
- Quick reassurance.
- Recent alert.
- Mini chart usage today.

### Bố cục mobile/PWA

- Bottom navigation 4-5 mục.
- Alert banner ở đầu.
- Card xếp một cột.

### Trạng thái monitoring

- `Normal` dùng green.
- `Check required` dùng orange.
- `Emergency` dùng red.
- rPPG hiển thị `Ước tính thử nghiệm` và confidence.
- Khi confidence thấp, BPM là `Không đủ dữ liệu`, không hiển thị số cũ như số hiện tại.

## 14.5 Patient Overview - `/care/patient/:patientId`

- Hồ sơ trẻ.
- Trạng thái thiết bị.
- Calibration status và validation error caregiver-only.
- Cấu hình AAC.
- Dwell time.
- TTS/audio preference.
- Button calibration lại.
- Button unpair có confirm.

## 14.6 Communication Inbox - `/care/communications`

### List item

- Câu hoặc item được chọn.
- Category.
- Timestamp.
- Status.
- Unread indicator.
- Priority thường/SOS.

### Filter

- Tất cả.
- Chưa nhận.
- Đang xử lý.
- Hoàn thành.
- Ngày.

### Realtime

- Event mới đưa lên đầu nhưng không làm user mất vị trí khi đang xem detail.
- Deduplicate theo eventId.

## 14.7 Communication Detail - `/care/communications/:eventId`

- Câu giao tiếp.
- Danh sách item nguồn.
- Timeline trạng thái.
- Button `Đã nhận`, `Đang xử lý`, `Đã hoàn thành`.
- Quick reassurance buttons.
- Custom response input.
- Record/upload audio.
- Audit timestamps.

Khi trạng thái đã hoàn thành, không cho thay đổi ngược trừ khi có explicit reopen flow.

## 14.8 Alert Inbox - `/care/alerts`

- Tách section `Khẩn cấp` và `Cần kiểm tra`.
- RED_ALERT luôn nằm trên.
- Alert card hiển thị severity, reason summary, timestamp, acknowledgement state.
- Không trộn notification thường vào cùng style với SOS.

## 14.9 Alert Detail - `/care/alerts/:alertId`

### Nội dung

- Alert state.
- Reason codes.
- Manual SOS hay automatic rule.
- Camera quality.
- Facial state tổng hợp.
- rPPG value chỉ khi confidence đạt.
- Config version.
- Timeline created/acknowledged/checking/resolved.

### Actions

- `Đã nhận cảnh báo`.
- `Đang kiểm tra`.
- `Đã xử lý`.
- Gửi reassurance.

### Cảnh báo nội dung

- Không ghi `trẻ đang bị co giật`, `đột quỵ` hoặc kết luận tương tự.
- Chỉ ghi `Phát hiện nhiều tín hiệu bất thường, cần kiểm tra ngay`.

## 14.10 AAC Board Manager - `/care/aac`

### UI

- Danh sách category.
- Preview grid 4/6/9.
- Drag/drop order trên desktop; button move up/down trên mobile/accessibility.
- Toggle visibility.
- Count item.
- Button `Thêm danh mục`.
- Preview Patient Screen.

### Chức năng

- CRUD category.
- Reorder.
- Không cho xóa category đang chứa item nếu chưa confirm.
- Changes realtime nhưng phải được Patient Web áp dụng ở safe checkpoint.

## 14.11 Category Editor - `/care/aac/category/:categoryId`

- Grid/list item.
- Search label.
- Add/edit/hide/delete.
- Reorder.
- Page grouping theo 4 item để caregiver thấy đúng cách Patient Web hiển thị.
- Cảnh báo nếu page có quá nhiều item hoặc target label dài.

## 14.12 New/Edit AAC Item

### Fields

- Label hiển thị.
- Category.
- Image mode: icon hoặc ảnh thật.
- Upload image.
- Crop cơ bản.
- Alt text.
- Speech text.
- Quick sentence template.
- Visibility.
- Order.

### Validation

- Image type/size.
- Label length.
- Speech text length.
- Không cho script/HTML.
- Preview card.

## 14.13 Presets - `/care/presets`

- Preset sáng, trưa, tối hoặc tình huống.
- Chọn category/item xuất hiện.
- Xem preview 4-item pages.
- Schedule là P1; MVP có thể cho caregiver bật preset thủ công.
- Không đổi preset giữa lúc patient đang dwelling.

## 14.14 Reassurance Library - `/care/reassurance`

- Câu mẫu.
- Tạo câu mới.
- TTS voice preview.
- Upload/record audio.
- Đánh dấu favorite.
- Gửi ngay tới Patient Web.
- Hiển thị delivery status.

## 14.15 Care Log - `/care/history`

- Timeline giao tiếp.
- Timeline cảnh báo.
- Filter ngày, loại sự kiện, trạng thái.
- Search từ khóa không nhạy cảm theo chính sách.
- Export không nằm trong P0 trừ khi cuộc thi yêu cầu.

## 14.16 Analytics - `/care/analytics`

### Chỉ số

- Số lượt giao tiếp theo ngày.
- Nhu cầu được chọn nhiều.
- Khung giờ sử dụng.
- Category/item frequency.
- Sent/received/processing/completed.
- Average caregiver response time.
- Calibration success/failure.
- Tracking loss count.
- CHECK_REQUIRED và RED_ALERT theo reason code.

### Charts

- Bar chart cho top needs.
- Line chart cho events theo ngày.
- Stacked bar hoặc simple status distribution.
- Không vẽ BPM như medical trend chính xác.
- Có label `Dữ liệu hỗ trợ theo dõi, không phải chẩn đoán`.

## 14.17 Settings - `/care/settings`

### Nhóm setting

- Grid size 4/6/9.
- Dwell time.
- Sound feedback.
- TTS enabled/voice.
- Real image/icon mode.
- Calibration mode 5/9.
- Notification sound.
- Image Segmenter enabled nếu được backend/Remote Config cho phép.
- rPPG display flag.

Remote Config có thể override một số threshold, nhưng UI phải hiển thị source và không cho thay đổi setting bị khóa.

## 14.18 Devices - `/care/devices`

- Device name.
- Browser/platform.
- Online/offline.
- Last seen.
- Camera permission state tổng quát.
- Unpair.
- Re-pair.

## 14.19 Notification Settings - `/care/notifications`

- Xin permission FCM.
- Kiểm tra token registration.
- Test notification.
- Toggle communication notification.
- SOS notification không được tắt hoàn toàn nếu app được dùng làm caregiver chính; nếu cho tắt phải có cảnh báo rõ.
- Audio test.

---

# 15. Component library bắt buộc

## 15.1 Base UI

- `OcuButton`
- `OcuIconButton`
- `OcuCard`
- `OcuModal`
- `OcuDrawer`
- `OcuInput`
- `OcuSelect`
- `OcuToggle`
- `OcuTabs`
- `OcuBadge`
- `OcuStatusChip`
- `OcuToast`
- `OcuSkeleton`
- `OcuEmptyState`
- `OcuErrorState`
- `OcuConfirmDialog`

Mỗi component phải có:

- Default.
- Hover/focus cho Caregiver.
- Active.
- Disabled.
- Loading.
- Keyboard focus visible.
- Dark/emergency variant nếu cần.

## 15.2 Gaze components

- `GazeTarget`
- `DwellProgressRing`
- `GazeCursorDebug`
- `GazePageArrow`
- `TrackingConfidenceIndicator`
- `CameraQualityChip`
- `CalibrationPoint`
- `CalibrationProgress`
- `CalibrationResultCard`
- `FacePositionGuide`

`GazeCursorDebug` chỉ hiển thị trong calibration/debug, không mặc định trên AAC screen nếu làm trẻ phân tâm.

## 15.3 AAC components

- `AACCategoryCard`
- `AACItemCard`
- `AACGrid`
- `AACPageNavigator`
- `AACSelectionTray`
- `SentenceComposer`
- `SentencePreview`
- `CommunicationStatusStepper`
- `ManualSOSButton`
- `ReassuranceOverlay`

## 15.4 Caregiver components

- `PatientStatusCard`
- `DeviceStatusCard`
- `CommunicationEventCard`
- `CommunicationTimeline`
- `AlertCard`
- `AlertReasonList`
- `AACBoardPreview`
- `AACItemEditor`
- `ImageUploaderCropper`
- `AudioRecorder`
- `ReassuranceQuickActions`
- `AnalyticsMetricCard`
- `ChartContainer`

---

# 16. Design system component specifications

## 16.1 Primary button

- Height: 48px caregiver, 64-76px patient.
- Padding horizontal: 24-32px.
- Radius: 16px.
- Background: `#4C57A9`.
- Text: white, 800 weight.
- Shadow: `0 4px 0 #39427F`.
- Focus ring: `0 0 0 4px rgba(102,152,204,0.35)`.

## 16.2 Secondary button

- White/transparent background.
- 2px border `#D5D2CB`.
- Text `#4C57A9`.
- Shadow 4px neutral.

## 16.3 Danger/SOS button

- Background `#CC1400`.
- White text.
- Icon `TriangleAlert`.
- Shadow `#8F0E00`.
- Patient size tối thiểu 88px high hoặc dạng floating block lớn.

## 16.4 Status badge

| State | Background | Text/Icon |
|---|---|---|
| Normal/Completed | green 15% | dark green/ink |
| Information/Tracking | blue 15% | ink |
| Waiting/Check | orange/yellow | ink |
| Emergency | red | white |
| AI generated | purple 15% | purple-strong/ink |
| Reassurance | pink 18% | ink |

## 16.5 AAC card

- `aspect-ratio: 1 / 1` hoặc gần vuông.
- 24px radius.
- 2px border.
- Image chiếm 60-70% card.
- Label tối thiểu 20px, weight 800.
- Không có icon hành động nhỏ bên trong card.
- Gaze focus không đổi layout.

## 16.6 Progress ring

- Track: `#FFEC89` hoặc neutral.
- Fill: `#4C57A9`.
- Thickness đủ rõ ở khoảng cách sử dụng.
- Khi confidence mất, reset ring với fade ngắn.

---

# 17. Shared frontend data states

## 17.1 Session state

```ts
type PatientSessionState =
  | 'UNPAIRED'
  | 'PAIRING'
  | 'PERMISSIONS_REQUIRED'
  | 'DEVICE_SETUP'
  | 'CALIBRATION_REQUIRED'
  | 'READY'
  | 'OFFLINE_FALLBACK'
  | 'CHECK_REQUIRED'
  | 'SOS_ACTIVE';
```

## 17.2 Camera quality

```ts
type CameraQualityState =
  | 'GOOD'
  | 'LOW_LIGHT'
  | 'OVEREXPOSED'
  | 'BLUR_OR_MOTION'
  | 'FACE_NOT_FOUND'
  | 'FACE_OFF_CENTER'
  | 'LOW_FPS'
  | 'UNKNOWN';
```

## 17.3 Communication status

```ts
type CommunicationStatus =
  | 'QUEUED_LOCAL'
  | 'SENT'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';
```

## 17.4 Safety status

```ts
type SafetyState = 'NORMAL' | 'CHECK_REQUIRED' | 'RED_ALERT';
```

## 17.5 Calibration status

```ts
type CalibrationStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'RETRY_RECOMMENDED'
  | 'FAILED';
```

---

# 18. Realtime và API behavior Frontend

## 18.1 Realtime channels

Frontend cần lắng nghe:

- AAC board change.
- Communication event status.
- Reassurance command.
- Safety event.
- Alert acknowledgement.
- Device online/offline state.

## 18.2 Idempotency

- Mỗi event có `eventId`.
- UI deduplicate trước khi thêm notification/list.
- Reconnect không phát lại audio reassurance đã xử lý.
- Lưu `lastProcessedCommandId` cục bộ theo session.

## 18.3 Retry

- API read: retry có backoff.
- Communication send: queue local và retry.
- SOS: ưu tiên gửi ngay, retry mạnh hơn nhưng không tạo ID mới.
- Image upload: cho resume/retry và hiển thị progress.

## 18.4 Error mapping

Backend error code phải map thành thông báo người dùng:

```text
AUTH_EXPIRED -> Phiên đăng nhập đã hết hạn
PAIR_CODE_EXPIRED -> Mã kết nối đã hết hạn
DEVICE_ALREADY_PAIRED -> Thiết bị đã được liên kết
UPLOAD_TOO_LARGE -> Ảnh vượt quá dung lượng cho phép
NETWORK_UNAVAILABLE -> Chưa có kết nối mạng
SERVICE_UNAVAILABLE -> Dịch vụ tạm thời gián đoạn
```

Không hiển thị raw stack hoặc Firebase error object.

---

# 19. Edge case matrix bắt buộc

| Edge case | Patient Web behavior | Caregiver behavior |
|---|---|---|
| Không có nhu cầu muốn chọn trong 4 ô | Gaze vào arrow xuống để xem 4 item tiếp theo | Editor preview chia item theo page 4 ô |
| Đeo kính bị phản chiếu | Pause dwell, hướng dẫn đổi góc/ánh sáng | Hiển thị camera quality reason |
| Gaze ở giữa hai ô | Không chọn, giữ progress ở 0 | Không cần notification |
| Mất face khi đang dwell | Reset dwell | `CHECK_REQUIRED` nếu kéo dài |
| Nhắm mắt kéo dài | Không tạo click | Hiển thị signal tổng hợp, không chẩn đoán |
| Caregiver đổi board giữa dwell | Hoãn apply đến safe checkpoint | Hiển thị `Đang chờ đồng bộ` |
| Mất mạng sau khi chọn | Queue local, hiện `Chưa gửi được` | Event xuất hiện khi reconnect |
| Gemini timeout | Dùng câu mẫu | Không báo lỗi khẩn cấp |
| TTS lỗi | Hiển thị text, cho thử lại | Có thể gửi reassurance text |
| FCM permission bị từ chối | Không ảnh hưởng Patient Web | Banner hướng dẫn bật notification |
| rPPG confidence thấp | Không hiển thị BPM | Hiển thị `Không đủ dữ liệu` |
| Manual SOS khi camera lỗi | Vẫn gửi ngay | Nhận RED_ALERT |
| Alert event gửi lại | Deduplicate theo eventId | Không phát còi lặp vô hạn |
| Ảnh AAC lỗi | Placeholder + label | Cho caregiver thay ảnh |
| Grid 9 ô quá khó | Đề nghị về 6/4 ô | Setting quick action |
| User không calibration được | Manual mode | Caregiver được hướng dẫn điều chỉnh |

---

# 20. Responsive behavior

## 20.1 Patient Web

### Laptop/Desktop

- Fullscreen 16:9 hoặc tương đương.
- Grid 2x2 cho 4 item.
- Status bar tối giản.
- Composer dưới hoặc overlay safe zone.

### Tablet landscape

- Layout tương tự desktop.
- Giảm gap nhưng không giảm target dưới minimum.

### Tablet portrait

- Grid 2x2.
- Arrow page ở dưới.
- SOS nằm top hoặc bottom corner tùy calibration safe zone.

### Mobile

Patient Web mobile không phải thiết bị demo ưu tiên. Nếu mở:

- Cho manual mode.
- Không đảm bảo eye tracking production.
- Hiển thị recommendation chuyển sang tablet/laptop.

## 20.2 Caregiver Web/PWA

- Desktop: sidebar 240-280px.
- Tablet: collapsible sidebar.
- Mobile: bottom nav.
- Form một cột trên mobile.
- Charts có scroll hoặc đổi sang card summary.
- Alert detail dùng full-screen sheet trên mobile.

### Breakpoints đề xuất

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

# 21. Frontend task breakdown

Không ghi người phụ trách hoặc thời gian trong README này. Việc phân công được quản lý ở task sheet riêng.

## FE-01 - Frontend Foundation

### Cần làm

- Tạo React + TypeScript + Vite workspace.
- Thiết lập Tailwind.
- Cài font Nunito và Feather Bold.
- Thiết lập router.
- Thiết lập providers: Firebase, Query Client, auth, realtime.
- Thiết lập environment schema.
- Thiết lập lint, format, test.
- Tạo mock server/data.
- Tạo error boundary.
- Tạo capability check.

### Deliverables

- App chạy local.
- Public, Patient và Caregiver route group.
- Mock auth và mock patient profile.
- Shared layout skeleton.

### Definition of Done

- Build không lỗi.
- TypeScript strict.
- Không có secret client ngoài public config cho phép.
- Có `.env.example`.

## FE-02 - OcuSpeak Design System

### Cần làm

- Color tokens từ palette 8 màu.
- Typography tokens.
- Button/card/input/badge/modal/toast.
- Patient gaze target variants.
- Emergency variants.
- Storybook hoặc `/style-guide` nội bộ.
- Icon policy không emoji.

### Definition of Done

- Component có states đầy đủ.
- Contrast được kiểm tra.
- Keyboard focus rõ.
- Không dùng Duolingo logo/assets.

## FE-03 - Public and Demo Pages

- Landing.
- Demo guide.
- Requirements.
- Privacy.
- Unsupported browser.
- Production CTA flow.

## FE-04 - Caregiver Auth, Onboarding and Pairing

- Login.
- Create caregiver/child profile.
- Pair QR/code.
- Device connection state.
- Validation và error handling.

## FE-05 - Patient Permissions, Setup and Calibration

- Camera permission.
- Camera preview local.
- Face position guide.
- Calibration 5/9.
- Result screen.
- Manual mode fallback.

## FE-06 - Patient AAC Core

- Category grid.
- Item grid.
- 4-item paging với arrow gaze.
- Dwell focus/progress/select/cooldown.
- Sentence tray/composer.
- Manual SOS.
- Offline essential board.

## FE-07 - Communication and TTS Workflow

- Quick sentence.
- Gemini loading/fallback.
- Sentence confirmation.
- TTS/text fallback.
- Event send/retry.
- Status stepper.
- Reassurance overlay.

## FE-08 - Caregiver Dashboard and Communication Inbox

- Dashboard status cards.
- Communication list/detail.
- Realtime update.
- Status actions.
- Quick reassurance.

## FE-09 - AAC Editor and Media Management

- Board manager.
- Category editor.
- Item form.
- Image upload/crop.
- Reorder.
- Preview pages of 4 items.
- Presets.

## FE-10 - Safety and Alert UX

- Patient SOS state.
- Patient CHECK_REQUIRED.
- Caregiver alert inbox/detail.
- Acknowledgement lifecycle.
- Alert sound and FCM permission UX.
- Deduplication UI.

## FE-11 - History and Analytics

- Care Log.
- Filters.
- KPI cards.
- Charts.
- No medical interpretation.

## FE-12 - PWA, Offline and Notifications

- Manifest.
- Service worker.
- Add to Home Screen.
- FCM background notification.
- Local queue.
- Reconnect.
- Offline fallback UI.

## FE-13 - Integration, Testing and Production Hardening

- Integrate AI Engine output.
- Integrate backend contracts.
- E2E core flow.
- Test camera edge cases.
- Test accessibility.
- Test laptop/tablet/mobile caregiver.
- Bundle optimization.
- Production environment.
- Error reporting metadata đã lọc.

---

# 22. Frontend test checklist

## 22.1 Patient core

- Manual mode hoạt động khi camera bị từ chối.
- Calibration 5 điểm.
- Calibration 9 điểm.
- Calibration fail/retry.
- Grid 4/6/9.
- Gaze giữa hai target không chọn.
- Mất face reset dwell.
- Arrow down chuyển đúng 4 item tiếp theo.
- Arrow up quay lại đúng page.
- Selection không lặp trong cooldown.
- Board update không thay layout giữa dwell.
- Composer quick mode.
- Gemini fallback.
- TTS fallback.
- Manual SOS khi camera tắt.
- Offline queue.

## 22.2 Caregiver core

- Login/logout/session expiry.
- Tạo child profile.
- Pair code expiry.
- Realtime AAC update.
- Image upload fail/retry.
- Communication realtime.
- Status lifecycle.
- Reassurance text/audio.
- FCM foreground/background.
- SOS acknowledgement.
- Alert deduplication.
- Analytics filter.

## 22.3 Privacy

- Network tab không có frame/image/landmark/RGB raw.
- Client log không có token.
- Error report không có camera data.
- Gemini request không có camera data.
- Storage rules chặn ảnh không được phép.

## 22.4 Accessibility

- Keyboard navigation.
- Focus visible.
- Screen reader labels caregiver pages.
- Reduced motion.
- Text zoom 200% caregiver pages.
- Contrast.
- Touch target.
- Patient target size.

---

# 23. Production acceptance criteria cho Frontend

- Patient Web mở được từ production URL qua HTTPS.
- Caregiver PWA mở được và đăng nhập được.
- Pairing chạy trên production.
- Camera permission và calibration chạy trên thiết bị demo.
- AAC 4-item paging bằng gaze hoạt động.
- Manual SOS chạy khi camera bị tắt.
- Communication event gửi và caregiver nhận realtime.
- Caregiver gửi reassurance và Patient Web hiển thị/phát được.
- Alert acknowledgement đồng bộ hai chiều.
- Gemini lỗi không khóa AAC.
- TTS lỗi có text fallback.
- rPPG confidence thấp không hiển thị số.
- Không upload raw camera data.
- Không có secret trong bundle.
- Không dùng emoji trong UI.
- Icon dùng `lucide-react` hoặc SVG tối giản.

---

# 24. Prompt triển khai Design System chính

Prompt dưới đây dùng để yêu cầu công cụ sinh code tạo trang style guide OcuSpeak. Đây là prompt đã chuyển hướng từ style guide tham chiếu sang palette, font và component của OcuSpeak.

```text
Build a complete OcuSpeak frontend design-system reference page using React + TypeScript + Vite + Tailwind CSS. Use lucide-react for all interface icons. Do not use emoji. Do not use Duolingo logos, assets, names, flags, course images, or copied branded content. The visual direction may feel friendly, rounded, tactile, and learning-oriented, but all branding and content must be original to OcuSpeak.

Fonts
- Primary font: Nunito from Google Fonts with weights 400, 500, 600, 700, 800, 900.
- Display/heading font: Feather Bold from https://db.onlinewebfonts.com/c/14936bb7a4b6575fd2eee80a3ab52cc2?family=Feather+Bold.
- Fallback: Nunito, DIN Round Pro, -apple-system, BlinkMacSystemFont, sans-serif.

Load in index.html:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
<link href="https://db.onlinewebfonts.com/c/14936bb7a4b6575fd2eee80a3ab52cc2?family=Feather+Bold" rel="stylesheet" />

Color variables
--ocu-red: #CC1400
--ocu-orange: #FFAD33
--ocu-yellow: #FFEC89
--ocu-green: #6BAA75
--ocu-pink: #C28CAE
--ocu-purple: #967CC7
--ocu-indigo: #4C57A9
--ocu-blue: #6698CC
--canvas: #F8F5EC
--surface: #FFFFFF
--surface-soft: #F3F0E8
--ink: #28305F
--text: #434967
--text-muted: #737993
--border: #E4E1D8
--primary-hover: #414B94
--primary-shadow: #39427F
--danger-shadow: #8F0E00

Accessibility color rule
- Use white text on Ocu Indigo and Ocu Red.
- Use dark ink text on Orange, Yellow, Green, Pink and Ocu Blue.
- Never use color as the only status indicator.

Page structure
1. Fixed navbar, 64px height, white background, bottom border.
   - Left: original OcuSpeak wordmark text, vertical divider, label "UI SYSTEM".
   - Right: links "Foundations", "Patient AAC", "Caregiver", "Gaze", "Safety", "Components".
   - Max width 1440px.

2. Hero section
   - Cream canvas with a subtle Ocu Indigo to transparent gradient.
   - Heading in Feather Bold: "ocuspeak interface".
   - Description: "A gaze-first AAC interface system for clear communication, caregiver response, and privacy-preserving safety support."
   - Primary button: "OPEN PATIENT DEMO".
   - Secondary button: "OPEN CAREGIVER DEMO".
   - Buttons are rounded, tactile, and use a 4px bottom shadow.

3. Main grid
   - Two columns on desktop, one column below 900px.
   - Panels have 36px vertical and 40px horizontal padding.
   - Each panel has a small uppercase section label with an extending line.

Panel 1: OcuSpeak Palette
- Show 8 primary swatches in this exact order:
  Ocu Red #CC1400
  Ocu Orange #FFAD33
  Ocu Yellow #FFEC89
  Ocu Green #6BAA75
  Ocu Pink #C28CAE
  Ocu Purple #967CC7
  Ocu Indigo #4C57A9
  Ocu Blue #6698CC
- Also show canvas, surface, ink, text, muted, border.
- Each swatch has name, hex and semantic usage.

Panel 2: Typography
- 52px Feather Bold display sample "OcuSpeak" in Ocu Indigo.
- 36px Nunito 900 heading.
- 28px Feather Bold section title.
- 18px Nunito 600 body large.
- 16px Nunito 500 body.
- 13px Nunito 800 uppercase label.

Panel 3: Button Variants
- Primary: Ocu Indigo with white text and dark indigo shadow.
- Secondary: white with border and Ocu Indigo text.
- Danger: Ocu Red with white text.
- Warning: Ocu Orange with dark ink text.
- Success: Ocu Green with dark ink text.
- Include large Patient variants, regular Caregiver variants, small variants, loading and disabled states.

Panel 4: AAC Gaze Targets
- Show a 2x2 example grid.
- Each card has an image placeholder, large label and 24px radius.
- Show states: idle, focused, dwelling with progress ring, selected and cooldown.
- Include a separate large ChevronDown gaze target used to move to the next group of four AAC items.
- The four item positions must remain stable while paging.

Panel 5: Caregiver Cards
- Patient status card.
- Latest communication card.
- Reassurance action card.
- Device online/offline card.
- Use icons from lucide-react only.

Panel 6: Safety States
- NORMAL card using Ocu Green.
- CHECK REQUIRED card using Ocu Orange/Yellow.
- RED ALERT card using Ocu Red.
- Each card includes icon, status name, reason summary and action.
- Explicitly show that CHECK REQUIRED is not a diagnosis.

Panel 7: Form Components
- Input, select, toggle, upload field, image preview, audio recorder button and status badges.
- Include focus, validation error and disabled states.

Panel 8: Realtime and Progress Components
- Communication status stepper: Sent, Received, Processing, Completed.
- Calibration progress.
- Camera quality status.
- Tracking confidence.
- rPPG experimental label with an insufficient-confidence state that displays no BPM number.

Responsive rules
- At 900px and below, use one column and hide desktop nav links.
- At 600px and below, reduce panel padding, stack hero buttons and keep touch targets at least 44px.
- Patient gaze targets must remain at least 120x120px on supported tablet/laptop layouts.

Interaction rules
- Caregiver components may have hover and active states.
- Patient gaze targets must not move or scale on focus.
- Dwell progress is the main patient interaction feedback.
- Respect prefers-reduced-motion.
- Do not use decorative animations, emojis or tiny icon-only actions.
```

---

# 25. Prompt linh vật/hero video tham chiếu

Phần này được giữ nguyên như prompt đã cung cấp để dùng sau cho landing page, microsite, video hero hoặc mascot presentation. Nó không thay thế design system chính của ứng dụng. Font Anton/Condiment và palette `cream/neon` chỉ áp dụng cho section cô lập này nếu đội quyết định dùng.

```text
Setup requirements before building the section:

Google Fonts -- Load these in index.html head:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Condiment&display=swap" rel="stylesheet" />

Tailwind config -- Extend theme with these exact custom values:
fontFamily: {
  grotesk: ['Anton', 'sans-serif'],
  condiment: ['Condiment', 'cursive'],
},
colors: {
  cream: '#EFF4FF',
  neon: '#6FFF00',
}

font-grotesk maps to Anton, a tall, condensed display font. font-condiment maps to Condiment, a flowing cursive/script font.

No additional CSS classes or animations are used in this section. No keyframes, no transitions, no hover states. It is a static layout.

Build the following section as a React component using Tailwind CSS:

A section tag with classes relative overflow-hidden min-h-screen. No background color -- the background is a fullscreen video.

Background video: An absolutely positioned video element covering the entire section. Classes: absolute inset-0 w-full h-full object-cover. Attributes: autoPlay, loop, muted, playsInline. The source element points to:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4
with type="video/mp4".

Content wrapper: A div sitting on top of the video with classes: relative max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 z-10.

Inside the content wrapper are two rows:

ROW 1 (top): A div with classes flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 mb-12 sm:mb-16 md:mb-20. Contains two children:

Child A -- The heading: An h2 with classes font-grotesk text-[32px] sm:text-[48px] md:text-[60px] font-normal uppercase leading-[1.05] sm:leading-[1] md:leading-[1] text-cream relative. The text content is:
Hello!<br />
I'm orbis

Literally "Hello!" on line 1, "I'm orbis" on line 2, separated by a br. All rendered uppercase by Tailwind so it displays as "HELLO!" and "I'M ORBIS".

Inside the h2, after the text, there is an absolutely positioned span with the word "Orbis". This span has classes: font-condiment text-[36px] sm:text-[52px] md:text-[68px] font-normal normal-case text-neon mix-blend-exclusion leading-[0.79] tracking-[0.03em] absolute right-[-8px] bottom-[-20px] sm:bottom-[-30px] md:bottom-[-40px] -rotate-1 opacity-90.

Key details of this span:
- normal-case overrides the parent's uppercase, so it renders as "Orbis" with capital O and lowercase rbis in the Condiment cursive font.
- text-neon = #6FFF00.
- mix-blend-exclusion makes the green text interact with the video background.
- absolute right-[-8px] bottom-[-20px], responsive sm:bottom-[-30px] md:bottom-[-40px], positions it hanging below and slightly right of the parent heading, overlapping the word "orbis" above it.
- -rotate-1 gives it a slight counter-clockwise tilt.
- leading-[0.79] is a very tight line-height. tracking-[0.03em] adds subtle letter spacing.
- opacity-90 makes it 90% opaque.

Child B -- The paragraph: A p with classes font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase text-cream max-w-[266px] leading-relaxed. The text is:
"A digital object fixed beyond time and place. An exploration of distance, form, and silence in space"

font-mono uses the browser's default monospace font. leading-relaxed = 1.625 line-height.

ROW 2 (bottom): A div with classes flex justify-between items-start. Contains two children:

Child A -- Left text column, always visible: A div with classes flex flex-col gap-5 max-w-[335px]. Contains two identical p tags, each with classes font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase lg:text-cream text-[#010828] opacity-10 leading-relaxed. Both contain the same text:
"A digital object fixed beyond time and place. An exploration of distance, form, and silence in space"

Key detail: The color is text-[#010828] by default, switching to lg:text-cream on large screens. Combined with opacity-10, this text is extremely faint and serves as texture rather than readable content.

Child B -- Right text column, desktop only: A div with classes hidden lg:flex flex-col gap-5 max-w-[335px]. Contains two identical p tags with the exact same classes and text as Child A. This column is hidden on mobile/tablet and only appears on lg screens.

There are no animations, transitions, hover effects, scroll effects, or JavaScript interactions in this section. It is purely a static layout with a looping background video. The only motion comes from the autoplaying video itself.
```

---

# 26. Quy tắc dùng prompt linh vật trong OcuSpeak

Nếu section Orbis được dùng trong OcuSpeak:

- Chỉ dùng ở landing page hoặc trang giới thiệu.
- Không dùng làm nền Patient AAC.
- Không autoplay audio.
- Video phải có poster và fallback image.
- Tôn trọng `prefers-reduced-motion`; có thể thay video bằng poster.
- Không để chữ blend mode làm mất khả năng đọc trên background.
- Có overlay contrast nếu video quá sáng/tối.
- Không tải video trước khi cần trên thiết bị yếu.
- Tên linh vật có thể giữ là `Orbis` nếu đó là quyết định branding chính thức; nếu chưa quyết định, dùng placeholder trong code.
- Design system app chính vẫn dùng Nunito + Feather Bold và palette OcuSpeak 8 màu.

---

# 27. Những phần không được Frontend tự suy diễn

- Không tự đưa ra ngưỡng nhịp tim hoặc nhịp thở mang tính chẩn đoán.
- Không tự chuyển `CHECK_REQUIRED` thành `RED_ALERT`.
- Không gửi camera frame tới backend để debug.
- Không gửi landmarks đầy đủ tới Firestore.
- Không dùng Gemini để quyết định SOS.
- Không để UI ghi rằng trẻ đang mắc một tình trạng y tế cụ thể.
- Không cache lâu dài dữ liệu sinh trắc thô.
- Không để Remote Config tắt Manual SOS.
- Không dùng countdown hoặc animation khiến trẻ bị áp lực khi calibration.

---

# 28. MVP cut rules cho Frontend

Nếu thiếu thời gian, giữ theo thứ tự:

### Bắt buộc giữ

- Patient manual AAC.
- Calibration gaze.
- Gaze dwell chọn 4 ô.
- Arrow chuyển nhóm 4 item.
- Manual SOS.
- Caregiver login/pairing.
- AAC editor cơ bản.
- Communication realtime.
- Reassurance text.
- SOS notification và acknowledgement.
- Privacy page.
- Production link.

### Có thể đơn giản hóa

- Preset scheduling chuyển thành bật thủ công.
- Audio recording chỉ giữ upload hoặc TTS.
- Analytics chỉ giữ 2-3 chart.
- 9-grid có thể để experimental.
- Image Segmenter UI chỉ hiển thị feature flag.
- rPPG chỉ hiển thị experimental card hoặc tắt.
- Automatic RED_ALERT mặc định tắt.

### Không được cắt

- Manual SOS.
- Manual input fallback.
- Camera data privacy boundary.
- Low-confidence handling.
- Event deduplication.
- Text fallback khi TTS/Gemini lỗi.

---

# 29. Nguồn tài liệu nội bộ

- `OcuSpeak_README_TECHNICAL_TASKS.md`
- `Proposal Dự án OcuSpeak - AI Riser Vietnam 2026(1).pdf`
- `TASK.xlsx`
- `Pasted text.txt`
- `image(3).png`

Tài liệu này chỉ đặc tả Frontend. Backend, AI Engine, Security Rules và deployment infrastructure phải tiếp tục tuân theo README kỹ thuật chung của OcuSpeak.
