import { z } from "zod";

export const completeProfileSchema = z.object({
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  dateOfBirth: z.string().min(1, "Ngày sinh là bắt buộc"),
});
