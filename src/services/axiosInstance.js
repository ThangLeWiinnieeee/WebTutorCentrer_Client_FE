import axios from "axios";
import { toast } from "sonner";
import tokenStorage from "@/utils/tokenStorage";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processPendingRequests = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingRequests = [];
};

// Các endpoint chạy ngầm, không cần hiện toast thành công
const SILENT_ENDPOINTS = [
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  API_ENDPOINTS.AUTH.USER_INFO,
];

axiosInstance.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    const method = config.method?.toUpperCase();
    const isSilent = SILENT_ENDPOINTS.some((ep) => config.url?.includes(ep));

    // Hiện toast thành công cho các action của người dùng (không phải GET và không phải endpoint ngầm)
    if (method !== "GET" && !isSilent && data?.message) {
      toast.success(data.message);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Tự động refresh token khi nhận 401 và người dùng đang đăng nhập
    if (status === 401 && !originalRequest._retry && tokenStorage.get()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
        const newToken = data.data.accessToken;
        tokenStorage.set(newToken);
        processPendingRequests(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processPendingRequests(refreshError);
        tokenStorage.remove();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Hiển thị toast cho tất cả lỗi người dùng (4xx) và lỗi hệ thống (5xx)
    if (status && status >= 400) {
      if (status >= 500) {
        toast.error("Lỗi hệ thống, vui lòng thử lại sau");
      } else {
        toast.error(message || "Đã có lỗi xảy ra, vui lòng thử lại");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
