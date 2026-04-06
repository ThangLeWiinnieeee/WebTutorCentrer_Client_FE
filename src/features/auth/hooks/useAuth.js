import { useSelector, useDispatch } from "react-redux";
import { clearError } from "@/features/auth/store/authSlice";
import { logoutThunk } from "@/features/auth/store/authThunks";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const logout = () => dispatch(logoutThunk());
  const clearAuthError = () => dispatch(clearError());

  return { user, accessToken, isAuthenticated, loading, error, logout, clearAuthError };
};

export default useAuth;
