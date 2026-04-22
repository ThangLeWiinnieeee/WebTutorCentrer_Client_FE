import useAuth from "@/features/auth/hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">
          Chào mừng, {user?.fullName} 👋
        </h1>
        <p className="mt-2 text-slate-500">
          Đây là trang chủ của WebTutorCenter. Nội dung sẽ được cập nhật thêm.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
