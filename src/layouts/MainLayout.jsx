import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

export default MainLayout;
