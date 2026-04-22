const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    GOOGLE_LOGIN: "/auth/google",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_FORGOT_PASSWORD_OTP: "/auth/verify-forgot-password-otp",
    RESET_PASSWORD: "/auth/reset-password",
    USER_INFO: "/auth/user-info",
  },
};

export default API_ENDPOINTS;
