# Cấu trúc thư mục — Frontend (WebTutorCenter_Client_FE)

> **Stack:** React 19 · Vite · Redux Toolkit · React Router v7 · Tailwind CSS v4 · shadcn/ui · React Hook Form · Zod · Axios · Sonner

> **Cách đọc cây thư mục bên dưới:** phần sau dấu `#` trên cùng một dòng là **ghi chú ngắn** về nội dung / trách nhiệm của file hoặc thư mục đó.

---

## Tổng quan

```
WebTutorCenter_Client_FE/
├── public/                       # Tài sản tĩnh (URL gốc /), Vite phục vụ nguyên file
│   └── favicon.svg               # Icon tab trình duyệt, được link trong index.html
├── src/                          # Toàn bộ mã nguồn ứng dụng
│   ├── App.jsx                   # Gốc view: bao AuthBootstrap, RouterProvider, Toaster (Sonner)
│   ├── main.jsx                  # Entry React: StrictMode, GoogleOAuthProvider, Provider Redux, mount App, import CSS
│   ├── index.css                 # Global CSS: @import Tailwind, biến theme (shadcn), custom layer
│   │
│   ├── app/
│   │   └── store.js              # configureStore: reducer auth; export store dùng trong Provider
│   │
│   ├── components/               # UI tái sử dụng (toàn app + primitive shadcn)
│   │   ├── shared/               # Layout / route helpers không gắn riêng một feature
│   │   │   ├── Header.jsx        # Thanh trên: logo → /, avatar/chữ cái đầu + tên → /profile, đăng xuất
│   │   │   ├── ProtectedRoute.jsx # Cần login; optional skipProfileCheck; thiếu SĐT/ngày sinh → /complete-profile
│   │   │   └── GuestRoute.jsx    # Chỉ truy cập khi chưa login; đã login → chuyển /profile
│   │   └── ui/                   # shadcn/ui: primitive, dùng Radix + class-variance-authority + cn()
│   │       ├── button.jsx        # Nút (variant/size), asChild; @radix-ui/react-slot
│   │       ├── card.jsx         # Bố cục Card (Header, Content, …)
│   │       ├── form.jsx         # Form, FormField, FormItem, FormLabel, FormMessage; tích hợp react-hook-form Controller
│   │       ├── input.jsx        # Ô nhập văn bản, forwardRef
│   │       ├── label.jsx        # Nhãn form; @radix-ui/react-label
│   │       └── select.jsx        # Hộp chọn: Select, Trigger, Content, Item…; @radix-ui/react-select
│   │
│   ├── constants/
│   │   └── apiEndpoints.js      # Object API_ENDPOINTS: đường dẫn tương đối /auth/… (dùng với VITE_API_BASE_URL)
│   │
│   ├── features/                 # Tổ chức theo domain (feature-based)
│   │   ├── auth/                 # Đăng ký, đăng nhập, OTP, session, cập nhật user/avatar (qua auth API)
│   │   │   ├── index.js         # Re-export: pages, useAuth, authReducer, action/thunk từ slice
│   │   │   ├── components/
│   │   │   │   ├── AuthBootstrap.jsx  # Có accessToken thì dispatch getUserInfo; spinner đến khi xong (tránh flash sai auth)
│   │   │   │   ├── AuthLeftPanel.jsx   # Cột trái màn hình lớn: brand, giới thiệu, bullet (chỉ hiện lg+)
│   │   │   │   ├── login/
│   │   │   │   │   └── LoginForm.jsx   # Form email/mật khẩu (RHF+Zod), Google Identity Services
│   │   │   │   └── register/
│   │   │   │       ├── RegisterForm.jsx   # Form đăng ký đầy đủ, submit registerThunk
│   │   │   │       └── VerifyOtpForm.jsx    # Nhập OTP, xác thực / gọi lại gửi OTP
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js           # useSelector state.auth: user, token, loading, error; logout, clearError
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx        # Bố cục AuthLeftPanel + LoginForm; login/Google → redirect trang chủ hoặc complete-profile
│   │   │   │   ├── RegisterPage.jsx     # AuthLeftPanel + RegisterForm; thành công → /verify-otp (state email)
│   │   │   │   ├── VerifyOtpPage.jsx   # Nhận email từ location.state; gửi lại OTP có cooldown; xác thực xong → login
│   │   │   │   ├── ResendOtpPage.jsx   # Stub: chưa UI, component trả về null (chừa route)
│   │   │   │   ├── ForgotPasswordPage.jsx           # Stub: trả về null
│   │   │   │   ├── VerifyForgotPasswordOtpPage.jsx   # Stub: trả về null
│   │   │   │   └── ResetPasswordPage.jsx            # Stub: trả về null
│   │   │   ├── schemas/
│   │   │   │   └── authSchema.js        # Zod: register, login, otp, (v.v.) dùng cho form auth
│   │   │   ├── services/
│   │   │   │   └── authService.js      # Các hàm gọi axiosInstance: register, login, logout, getUserInfo, updateProfile, uploadAvatar, …
│   │   │   └── store/
│   │   │       ├── authSlice.js         # state: user, accessToken, isAuthenticated, loading, error, initialized; reducers + extraReducers cho thunk
│   │   │       └── authThunks.js        # createAsyncThunk: register, login, googleLogin, verifyOtp, resendOtp, logout, getUserInfo, updateProfile, uploadAvatar
│   │   │
│   │   └── profile/              # Màn hình hồ sơ: tách component, schema cập nhật hồ sơ, hoàn thiện hồ sơ bắt buộc
│   │       ├── index.js         # Export: ProfilePage, CompleteProfilePage, profileSchema, getInitials
│   │       ├── constants.js     # ROLE_CONFIG, GENDER_LABEL; toInputDate/formatDate cho form và hiển thị
│   │       ├── components/
│   │       │   ├── ProfileBadges.jsx         # ProfileBadge, StatusBadge (trạng thái bật/tắt)
│   │       │   ├── ProfileEditForm.jsx        # Form sửa hồ sơ (Họ tên, SĐT, giới tính, ngày sinh, email read-only, Hủy/Lưu)
│   │       │   ├── ProfileInfoRow.jsx          # Một dòng thông tin read-only: nhãn + giá trị
│   │       │   ├── ProfilePersonalCard.jsx    # Vùng cột phải: tiêu đề, nút Chỉnh sửa, vùng con (view hoặc form)
│   │       │   ├── ProfileSidebar.jsx          # Cột trái: avatar/camera, trạng thái, loại TK, thời gian tạo/cập nhật
│   │       │   └── ProfileViewDetails.jsx     # Chế độ xem: danh sách field + badge (không sửa)
│   │       ├── pages/
│   │       │   ├── ProfilePage.jsx            # Nối useForm + thunks: ghép ProfileSidebar, ProfilePersonalCard, edit/view; upload avatar
│   │       │   └── CompleteProfilePage.jsx   # Màn hộp giữa: bắt buộc SĐT + ngày sinh; submit updateProfile → về / 
│   │       ├── schemas/
│   │       │   ├── profileSchema.js         # Zod: fullName, phone (VN 10 số), gender, dateOfBirth cho form profile đầy đủ
│   │       │   └── completeProfileSchema.js # Zod: chỉ phone + dateOfBirth (bước hoàn tất hồ sơ tối thiểu)
│   │       └── utils/
│   │           └── profileUtils.js         # getInitials(tên) → 1–2 chữ cái avatar khi chưa có ảnh
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx        # Khung route auth: chỉ render <Outlet /> (form full width bên phải)
│   │   └── MainLayout.jsx        # Giao diện app đã login: <Header />, <main> chứa <Outlet />
│   │
│   ├── lib/
│   │   └── utils.js              # cn(…): merge classnames (clsx + tailwind-merge) cho shadcn
│   │
│   ├── pages/                    # Trang tổng quan, không nằm sâu trong features/
│   │   └── HomePage.jsx          # Trang chủ /: lời chào tên user, nội dung placeholder
│   │
│   ├── routes/
│   │   └── index.jsx             # createBrowserRouter: 3 cây con GuestRoute / ProtectedRoute skip / ProtectedRoute chuẩn
│   │
│   ├── services/
│   │   └── axiosInstance.js     # baseURL, withCredentials, gắn Bearer; refresh 401; toast err/success; hàng chờ khi refresh
│   │
│   └── utils/
│       └── tokenStorage.js      # get/set/remove key localStorage "accessToken"
│
├── components.json              # Cấu hình CLI shadcn: alias @/components, @/lib, style tailwind, baseColor
├── eslint.config.js             # Flat ESLint: recommended, react-hooks, react-refresh; ignore dist
├── jsconfig.json                # paths "@/*" → src/* (gợi ý import cho IDE, khớp alias Vite)
├── .env                         # (không commit secrets) VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID
├── index.html                   # root div, script /src/main.jsx, link favicon, title WebTutorCenter
├── package.json                 # script dev/build/lint; dependencies: react, vite, rtk, rhf, zod, axios, sonner, …
├── vite.config.js               # @vitejs/plugin-react, @tailwindcss/vite, alias @, port 4000, optimizeDeps radix-select
└── STRUCTURE.md                 # Tài liệu cấu trúc dự án (file này)
```

---

## Luồng hoạt động chính

### Khởi động app
```
main.jsx
  └── GoogleOAuthProvider
        └── Redux Provider
              └── App.jsx
                    └── AuthBootstrap
                          └── RouterProvider + Toaster
```

**AuthBootstrap** (`AuthBootstrap.jsx`): nếu có `accessToken` trong `tokenStorage` thì gọi `getUserInfoThunk` trước khi render children, tránh hiển thị nội dung khi chưa biết user.

### Định tuyến & route guard
| Nhánh | Guard | Nội dung |
|------|--------|----------|
| `GuestRoute` | Đã đăng nhập | `<Navigate to="/profile" />` — không xem lại trang auth |
| `ProtectedRoute` (`skipProfileCheck` = false) | Chưa login | → `/login` |
| cùng trên | Thiếu SĐT hoặc ngày sinh | → `/complete-profile` |
| `ProtectedRoute` (`skipProfileCheck`) | Chỉ cần login | `/complete-profile` — bỏ qua kiểm tra “profile đầy đủ” |

**Chi tiết route:** xem `src/routes/index.jsx`  
Auth (`/login`, `/register`, …) bọc bởi `GuestRoute`.  
`/complete-profile` bọc bởi `ProtectedRoute` với `skipProfileCheck`.  
`/` và `/profile` nằm dưới `MainLayout` + `ProtectedRoute` mặc định (cần profile đủ theo `ProtectedRoute`).

### Xử lý lỗi & thông báo (`axiosInstance.js`)
- **Response thành công, method không phải GET**, URL không nằm trong `SILENT_ENDPOINTS` (`/auth/refresh-token`, `/auth/user-info`), và server trả `message` → `toast.success` ngắn.
- **4xx từ BE** → `toast.error` với `message` từ server (hoặc câu mặc định).
- **5xx** → `toast.error` hệ thống cố định.
- **401**, đã có token, lần đầu: POST refresh token; lỗi refresh → `tokenStorage` xóa, `location.href` `/login`; thành công → cập nhật header, retry request (có hàng đợi khi nhiều 401 cùng lúc).

### Cấu trúc mỗi feature
```
features/<tên-feature>/
├── index.js          # (tuỳ chọn) barrel: export rút gọn từ ngoài import
├── components/       # UI thuộc nghiệp vụ feature
├── constants.js     # (tuỳ chọn) map nhãn / format dùng trong feature
├── hooks/
├── pages/
├── schemas/         # Zod cho form
├── services/        # Gọi API
├── store/           # (tuỳ feature) slice + thunks
└── utils/           # Hàm thuần, không gắn React
```

---

## Thêm feature mới

1. Tạo `src/features/<tên>/` theo cấu trúc trên
2. Thêm `index.js` barrel nếu cần import gọn
3. Đăng ký route trong `src/routes/index.jsx` (chọn `GuestRoute` / `ProtectedRoute` / `skipProfileCheck` phù hợp)
4. Thêm path trong `src/constants/apiEndpoints.js` và dùng trong `services`
5. Nếu dùng Redux: thêm `reducer` trong `src/app/store.js`
