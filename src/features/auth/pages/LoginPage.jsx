import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginThunk, googleLoginThunk } from "@/features/auth/store/authThunks";
import AuthLeftPanel from "@/features/auth/components/AuthLeftPanel";
import LoginForm from "@/features/auth/components/login/LoginForm";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      navigate("/", { replace: true });
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLoginThunk(credentialResponse.credential));
    if (googleLoginThunk.fulfilled.match(result)) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AuthLeftPanel />
      <LoginForm onSubmit={onSubmit} onGoogleSuccess={onGoogleSuccess} />
    </div>
  );
};

export default LoginPage;
