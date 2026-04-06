import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

import {
  LoginPage,
  RegisterPage,
  VerifyOtpPage,
  ResendOtpPage,
  ForgotPasswordPage,
  VerifyForgotPasswordOtpPage,
  ResetPasswordPage,
} from "@/features/auth";

const router = createBrowserRouter([
  // Auth routes (không cần đăng nhập)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-otp", element: <VerifyOtpPage /> },
      { path: "/resend-otp", element: <ResendOtpPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/verify-forgot-password-otp", element: <VerifyForgotPasswordOtpPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // Protected routes (cần đăng nhập)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Thêm các route sau khi đăng nhập tại đây
        ],
      },
    ],
  },
]);

export default router;
