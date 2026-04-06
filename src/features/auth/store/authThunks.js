import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/features/auth/services/authService";
import tokenStorage from "@/utils/tokenStorage";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      const { accessToken, user } = res.data.data;
      tokenStorage.set(accessToken);
      return { accessToken, user };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Đăng nhập thất bại");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      tokenStorage.remove();
    } catch (err) {
      tokenStorage.remove();
      return rejectWithValue(err.response?.data?.message || "Đăng xuất thất bại");
    }
  }
);

export const getUserInfoThunk = createAsyncThunk(
  "auth/getUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getUserInfo();
      return res.data.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không lấy được thông tin");
    }
  }
);
