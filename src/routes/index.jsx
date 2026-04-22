import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import GuestRoute from "@/components/shared/GuestRoute";
import HomePage from "@/pages/HomePage";
import { ProfilePage } from "@/features/profile";

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
  // Auth routes (chỉ dành cho khách, đã đăng nhập sẽ redirect về trang chủ)
  {
    element: <GuestRoute />,
    children: [
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
    ],
  },

  // Protected routes (cần đăng nhập)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export default router;
