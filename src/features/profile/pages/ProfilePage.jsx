import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { Camera, Loader2, Lock, X, Save } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import { updateProfileThunk, uploadAvatarThunk } from "@/features/auth/store/authThunks";
import { profileSchema } from "@/features/profile/schemas/profileSchema";
import { getInitials } from "@/features/profile/utils/profileUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// ─── Helpers ───────────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  user: { label: "Học sinh", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  tutor: { label: "Gia sư", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  admin: { label: "Quản trị viên", className: "bg-rose-50 text-rose-700 border border-rose-200" },
};

const GENDER_LABEL = { male: "Nam", female: "Nữ", other: "Khác" };

const toInputDate = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

const formatDate = (dateVal) => {
  if (!dateVal) return "—";
  const d = new Date(dateVal);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

// ─── Sub-components ────────────────────────────────────────────────────────

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
    <span className="w-40 shrink-0 text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800 break-all">{value || "—"}</span>
  </div>
);

const Badge = ({ className, children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

const StatusBadge = ({ active, activeLabel = "Hoạt động", inactiveLabel = "Không hoạt động" }) =>
  active ? (
    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">{activeLabel}</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-500 border border-slate-200">{inactiveLabel}</Badge>
  );

// ─── Main component ────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      gender: user?.gender ?? "",
      dateOfBirth: toInputDate(user?.dateOfBirth),
    },
  });

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] ?? { label: user.role, className: "bg-slate-100 text-slate-600" };
  const displayAvatar = avatarPreview || user.avatar;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setIsUploadingAvatar(true);

    const result = await dispatch(uploadAvatarThunk(file));

    setIsUploadingAvatar(false);

    if (result.error) {
      setAvatarPreview(null);
    } else {
      URL.revokeObjectURL(localUrl);
      setAvatarPreview(null);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = () => {
    form.reset({
      fullName: user.fullName ?? "",
      phone: user.phone ?? "",
      gender: user.gender ?? "",
      dateOfBirth: toInputDate(user.dateOfBirth),
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const onSubmit = async (data) => {
    const result = await dispatch(updateProfileThunk(data));
    if (!result.error) {
      setIsEditing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

        {/* ── CỘT TRÁI ── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="group relative inline-block">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user.fullName}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#1e3a5f] text-3xl font-bold text-white ring-4 ring-slate-100 select-none">
                    {getInitials(user.fullName)}
                  </div>
                )}

                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="h-7 w-7 animate-spin text-white" />
                  </div>
                )}

                {!isUploadingAvatar && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f] text-white shadow-lg ring-2 ring-white transition-all hover:scale-110 hover:bg-[#2d5a9e] active:scale-95"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <h2 className="mt-4 text-xl font-bold text-slate-800 leading-tight">{user.fullName}</h2>
              <p className="mt-1 text-sm text-slate-500 break-all">{user.email}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Badge className={roleConfig.className}>{roleConfig.label}</Badge>
              </div>
            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* Trạng thái */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Xác thực email</span>
                <StatusBadge active={user.isVerified} activeLabel="Đã xác thực" inactiveLabel="Chưa xác thực" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Trạng thái</span>
                <StatusBadge active={user.isActive} activeLabel="Hoạt động" inactiveLabel="Bị khoá" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Loại tài khoản</span>
                <Badge className="bg-violet-50 text-violet-700 border border-violet-200">
                  {user.type === "google" ? "Google" : "Email"}
                </Badge>
              </div>
            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* Ngày */}
            <div className="space-y-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400">Ngày tham gia</span>
                <span className="text-sm font-medium text-slate-700">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400">Cập nhật lần cuối</span>
                <span className="text-sm font-medium text-slate-700">{formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CỘT PHẢI ── */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-700">Thông tin cá nhân</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            )}
          </div>

          <div className="px-6 py-5">
            {isEditing ? (
              /* ── CHẾ ĐỘ CHỈNH SỬA ── */
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Họ và tên <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ và tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Số điện thoại <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="VD: 0912345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới tính</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ngày sinh <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email — chỉ đọc */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <Lock className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <Input
                      value={user.email}
                      disabled
                      className="cursor-not-allowed bg-slate-50 text-slate-500"
                    />
                  </div>

                  {/* Nút Hủy + Lưu thay đổi */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="min-w-[100px] border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <X className="mr-1.5 h-4 w-4" />
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-w-[140px] bg-[#1e3a5f] text-white hover:bg-[#2d5a9e]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="mr-1.5 h-4 w-4" />
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              /* ── CHẾ ĐỘ XEM ── */
              <div className="space-y-4 divide-y divide-slate-100">
                <InfoRow label="Họ và tên" value={user.fullName} />
                <div className="pt-4">
                  <InfoRow label="Email" value={user.email} />
                </div>
                <div className="pt-4">
                  <InfoRow label="Số điện thoại" value={user.phone} />
                </div>
                <div className="pt-4">
                  <InfoRow label="Giới tính" value={GENDER_LABEL[user.gender] ?? null} />
                </div>
                <div className="pt-4">
                  <InfoRow label="Ngày sinh" value={formatDate(user.dateOfBirth)} />
                </div>
                <div className="pt-4">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="w-40 shrink-0 text-sm text-slate-500">Vai trò</span>
                    <Badge className={roleConfig.className}>{roleConfig.label}</Badge>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="w-40 shrink-0 text-sm text-slate-500">Loại tài khoản</span>
                    <Badge className="bg-violet-50 text-violet-700 border border-violet-200">
                      {user.type === "google" ? "Google" : "Email / Mật khẩu"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
