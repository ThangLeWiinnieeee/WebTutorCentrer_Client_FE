import { z } from "zod";

const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .regex(phoneRegex, "Số điện thoại không hợp lệ (phải là số VN 10 số)"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    role: z.enum(["student", "tutor"]).default("student"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ gồm các chữ số"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const verifyForgotPasswordOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ gồm các chữ số"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
