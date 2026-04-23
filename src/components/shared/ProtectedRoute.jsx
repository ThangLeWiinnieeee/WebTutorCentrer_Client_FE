import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

const isProfileIncomplete = (user) =>
  user && (!user.phone || !user.dateOfBirth);

/**
 * skipProfileCheck: true  → chỉ yêu cầu đăng nhập (dùng cho /complete-profile)
 * skipProfileCheck: false → yêu cầu đăng nhập + profile đầy đủ
 */
const ProtectedRoute = ({ skipProfileCheck = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!skipProfileCheck && isProfileIncomplete(user)) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
