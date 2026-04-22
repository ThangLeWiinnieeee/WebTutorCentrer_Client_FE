import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
