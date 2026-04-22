import useAuth from "@/features/auth/hooks/useAuth";
import { getInitials } from "@/features/profile/utils/profileUtils";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
    <span className="w-36 shrink-0 text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800">{value || "—"}</span>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formattedDob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Avatar + tên */}
      <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1e3a5f] text-2xl font-bold text-white ring-4 ring-slate-100">
            {getInitials(user.fullName)}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-800">{user.fullName}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {user.role === "tutor" ? "Gia sư" : "Học sinh"}
          </span>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-700">Thông tin cá nhân</h3>
        <div className="space-y-3 divide-y divide-slate-100">
          <InfoRow label="Họ và tên" value={user.fullName} />
          <div className="pt-3"><InfoRow label="Email" value={user.email} /></div>
          <div className="pt-3"><InfoRow label="Số điện thoại" value={user.phone} /></div>
          <div className="pt-3"><InfoRow label="Ngày sinh" value={formattedDob} /></div>
          <div className="pt-3">
            <InfoRow label="Loại tài khoản" value={user.type === "google" ? "Google" : "Email / Mật khẩu"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
