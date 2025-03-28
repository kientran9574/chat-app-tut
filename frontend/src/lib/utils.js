import z from "zod";
export const schema = z.object({
  email: z
    .string()
    .email("Email Không đúng định dạng")
    .min(6, "Độ dài là từ 6-160 ký tự")
    .max(160, "Độ dài là từ 6-160 ký tự"),
  password: z
    .string()
    .min(6, "Độ dài là từ 6-160 ký tự")
    .max(160, "Độ dài là từ 6-160 ký tự"),
  fullName: z
    .string()
    .trim(6, "Tên không được để trống")
    .min(6, "Tối thiểu là 6 kí tự"),
});
export const Loginschema = z.object({
  email: z
    .string()
    .email("Email Không đúng định dạng")
    .min(6, "Độ dài là từ 6-160 ký tự")
    .max(160, "Độ dài là từ 6-160 ký tự"),
  password: z
    .string()
    .min(6, "Độ dài là từ 6-160 ký tự")
    .max(160, "Độ dài là từ 6-160 ký tự"),
});
export const loginSchema = Loginschema;
export const registerSchema = schema;
//
// export const getAuthUserLocalStorage = () => {
//   const user = localStorage.getItem("authUser");
//   return user ? JSON.parse(user) : null; // Chuyển từ JSON string về object
// };

// export const setAuthUserLocalStorage = (data) => {
//   localStorage.setItem("authUser", JSON.stringify(data));
// };

// export const removeAuthUserLocalStorage = () => {
//   localStorage.removeItem("authUser");
// };
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
