# OcuSpeak — Hướng dẫn chạy nhanh (Backend đã nối Frontend)

## 1. Yêu cầu
- Node.js 18+
- PostgreSQL đang chạy (local hoặc Docker)

## 2. Chạy Backend

```bash
cd backend
npm install
```

Tạo database (một lần):
```bash
createdb ocuspeak_dev   # hoặc: psql -c "CREATE DATABASE ocuspeak_dev;"
```

Kiểm tra `.env.development` đúng thông tin DB của bạn (mặc định user `postgres` / pass `password`).

```bash
npm run build
npm run seed      # tạo caregiver + trẻ + AAC item + thiết bị mẫu
node dist/main.js # hoặc: npm run start:dev để có hot-reload
```

Backend chạy tại `http://localhost:3000/api`, Swagger docs tại `http://localhost:3000/api/docs`,
realtime socket tại namespace `/realtime`.

Tài khoản demo sau khi seed:
- Email: `demo@ocuspeak.dev`
- Mật khẩu: `demo123456`
- Mã ghép nối Patient Web: `DEMO01`

## 3. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

File `.env` đã trỏ sẵn `VITE_API_BASE_URL=http://localhost:3000/api` và
`VITE_SOCKET_URL=http://localhost:3000`. Đổi lại nếu bạn deploy backend ở nơi khác.

Mở `http://localhost:5173`:
- `/care/login` — đăng nhập bằng tài khoản demo ở trên (Caregiver App)
- `/care/pair` — tạo mã ghép nối thật cho hồ sơ trẻ đang chọn
- `/patient/connect` — nhập mã (mặc định gợi ý `DEMO01`) để Patient Web ghép nối
- `/patient/aac` → chọn biểu tượng → `/patient/compose` → gửi — sự kiện được lưu thật
  vào backend và caregiver nhận ngay lập tức qua Socket.io

## 4. Firebase (tuỳ chọn)
Chưa cấu hình thì backend tự chạy ở **chế độ mock** (log ra console thay vì gửi
push thật) — không cần làm gì thêm để chạy thử. Khi có project Firebase thật,
điền `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` vào
`backend/.env.development` (hoặc staging/production tương ứng) là dùng được ngay,
không cần sửa code.

## 5. Đã kết nối thật với backend
- `care/LoginPage`, `care/OnboardingPage` (nút Google) — đăng nhập/đăng ký thật
- `care/PairPage` — tạo mã ghép nối thật + tự cập nhật khi Patient Web ghép nối
  thành công (qua socket)
- `patient/ConnectPage` — ghép nối thiết bị thật bằng mã 6 ký tự
- `patient/ComposePage` — gửi communication event thật, lưu DB, đẩy realtime

## 6. Còn dùng dữ liệu mẫu tĩnh (mock)
- Danh sách/danh mục biểu tượng AAC hiển thị trong `AacCategoriesPage` /
  `AacItemsPage` (giao diện chọn biểu tượng) — vẫn lấy từ
  `src/data/mockData.ts` vì model danh mục (icon, màu, thứ tự) chưa có ở
  backend. Khi gửi đi (ComposePage) thì sự kiện vẫn được lưu thật vào backend.
- Các trang thống kê/lịch sử ở Caregiver App (`AnalyticsPage`, `HistoryPage`,
  `NotificationsPage`...) — chưa nối, vẫn đọc `mockData.ts`. Có thể nối tiếp
  theo đúng pattern trong `src/services/api/apiClient.ts`
  (`getCommunicationEvents`, `getSosAlerts`, ...).

## 7. Test đã chạy
- Backend: `npm run build` sạch, `npx jest` 17/17 suite pass, test thủ công
  toàn bộ luồng qua curl (auth → child → pairing → aac → communication →
  caregiver response → sos → monitoring) và test kênh realtime Socket.io.
- Frontend: `npx tsc --noEmit` sạch, `npm run build` production thành công.
