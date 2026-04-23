import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "@/routes";
import AuthBootstrap from "@/features/auth/components/AuthBootstrap";

const App = () => {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthBootstrap>
  );
};

export default App;
