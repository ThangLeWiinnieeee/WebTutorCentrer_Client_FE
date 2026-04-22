# Cấu trúc thư mục — Frontend (WebTutorCenter_Client_FE)

> **Stack:** React 19 · Vite · Redux Toolkit · React Router v7 · Tailwind CSS v4 · shadcn/ui · React Hook Form · Zod · Axios · Sonner

---

## Tổng quan

```
WebTutorCenter_Client_FE/
├── src/
│   ├── App.jsx                   # Root component: RouterProvider + Toaster + AuthBootstrap
│   ├── main.jsx                  # Entry point: ReactDOM.render + GoogleOAuthProvider + Redux Provider
│   ├── index.css                 # Global styles (Tailwind directives)
│   │
│   ├── app/
│   │   └── store.js              # Cấu hình Redux store
│   │
│   ├── components/
│   │   ├── shared/               # Component dùng chung toàn app
│   │   │   ├── Header.jsx        # Header sticky: logo, avatar/tên người dùng, nút đăng xuất
│   │   │   ├── ProtectedRoute.jsx # Route guard: chưa đăng nhập → /login
│   │   │   └── GuestRoute.jsx    # Route guard: đã đăng nhập → /profile
│   │   └── ui/                   # Component UI tái sử dụng (shadcn/ui)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── form.jsx
│   │       ├── input.jsx
│   │       └── label.jsx
│   │
│   ├── constants/
│   │   └── apiEndpoints.js       # Tập trung tất cả đường dẫn API endpoint
│   │
│   ├── features/                 # Tổ chức theo domain (feature-based)
│   │   ├── auth/                 # Toàn bộ logic xác thực
│   │   │   ├── index.js          # Barrel export cho feature auth
│   │   │   ├── components/
│   │   │   │   ├── AuthBootstrap.jsx     # Khôi phục session khi reload (gọi getUserInfo)
│   │   │   │   ├── AuthLeftPanel.jsx     # Panel trái trang auth (logo, marketing)
│   │   │   │   ├── login/
│   │   │   │   │   └── LoginForm.jsx     # Form đăng nhập + nút Google
│   │   │   │   └── register/
│   │   │   │       ├── RegisterForm.jsx  # Form đăng ký
│   │   │   │       └── VerifyOtpForm.jsx # Form nhập OTP xác thực email
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js            # Hook lấy trạng thái auth từ Redux
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── VerifyOtpPage.jsx
│   │   │   │   ├── ResendOtpPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   ├── VerifyForgotPasswordOtpPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   ├── schemas/
│   │   │   │   └── authSchema.js         # Zod validation schemas (register, login, otp...)
│   │   │   ├── services/
│   │   │   │   └── authService.js        # Axios calls đến auth API
│   │   │   └── store/
│   │   │       ├── authSlice.js          # Redux slice: user, accessToken, isAuthenticated
│   │   │       └── authThunks.js         # Async thunks: login, register, logout, googleLogin...
│   │   │
│   │   └── profile/              # Quản lý hồ sơ người dùng
│   │       ├── index.js          # Barrel export cho feature profile
│   │       ├── pages/
│   │       │   └── ProfilePage.jsx       # Trang xem thông tin cá nhân
│   │       └── utils/
│   │           └── profileUtils.js       # getInitials() — lấy chữ cái đầu tên
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx        # Layout trang auth (chỉ render <Outlet />)
│   │   └── MainLayout.jsx        # Layout trang chính: Header + <main><Outlet /></main>
│   │
│   ├── lib/
│   │   └── utils.js              # Tiện ích shadcn: cn() (classnames merge)
│   │
│   ├── pages/                    # Trang tổng quan, không thuộc domain cụ thể
│   │   └── HomePage.jsx          # Trang chủ sau khi đăng nhập
│   │
│   ├── routes/
│   │   └── index.jsx             # Định nghĩa toàn bộ routes với React Router
│   │
│   ├── services/
│   │   └── axiosInstance.js      # Axios instance: request interceptor (auth header),
│   │                             #   response interceptor (refresh token, toast lỗi/thành công)
│   │
│   └── utils/
│       └── tokenStorage.js       # Đọc/ghi/xoá accessToken trong localStorage
│
├── .env                          # VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID
├── index.html
├── package.json
└── vite.config.js
```

---

## Luồng hoạt động chính

### Khởi động app
```
main.jsx
  └── GoogleOAuthProvider (clientId từ .env)
        └── Redux Provider (store)
              └── App.jsx
                    └── AuthBootstrap.jsx  ← có token → gọi getUserInfo để khôi phục session
                          └── RouterProvider + Toaster
```

### Route guard
| Loại route | Guard | Hành động |
|---|---|---|
| `/login`, `/register`, auth pages | `GuestRoute` | Đã login → redirect `/profile` |
| `/`, `/profile`, trang nội dung | `ProtectedRoute` | Chưa login → redirect `/login` |

### Xử lý lỗi & thông báo
- **Lỗi người dùng** (4xx từ BE) → `axiosInstance` interceptor → `toast.error(message)`
- **Lỗi hệ thống** (5xx) → `toast.error("Lỗi hệ thống...")`
- **Thành công** (POST/PUT/PATCH/DELETE) → `toast.success(message)` — trừ `refresh-token`, `user-info`
- **401 + có token** → tự động gọi refresh token → retry request

### Cấu trúc mỗi feature
```
features/<tên-feature>/
├── index.js          # Barrel export (import từ bên ngoài dùng path này)
├── components/       # UI components của feature
├── hooks/            # Custom hooks
├── pages/            # Page components (được dùng trong routes)
├── schemas/          # Zod validation schemas
├── services/         # Axios API calls
├── store/            # Redux slice + thunks
└── utils/            # Hàm tiện ích riêng của feature
```

---

## Thêm feature mới

1. Tạo thư mục `src/features/<tên>/` theo cấu trúc trên
2. Tạo `index.js` barrel export
3. Thêm route vào `src/routes/index.jsx`
4. Thêm endpoint vào `src/constants/apiEndpoints.js`
5. Đăng ký reducer vào `src/app/store.js` (nếu dùng Redux)
