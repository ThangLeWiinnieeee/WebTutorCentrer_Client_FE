import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import { getUserInfoThunk } from "@/features/auth/store/authThunks";
import tokenStorage from "@/utils/tokenStorage";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const initialized = useSelector((state) => state.auth.initialized);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      dispatch(getUserInfoThunk()).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [dispatch]);

  if (!ready && !initialized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  return children;
};

export default AuthBootstrap;
