import React, { useState } from "react";
import axiosInstance from "../../lib/axios"; // Giả sử bạn đã có axios instance
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP và password mới

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data.message || "Có lỗi xảy ra");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Đặt lại mật khẩu thành công");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setStep(1);
    } catch (error) {
      toast.error(error.response?.data.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <h2 className="text-xl font-bold">Quên mật khẩu</h2>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input input-bordered"
              placeholder="Nhập email của bạn"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Gửi mã OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <h2 className="text-xl font-bold">Đặt lại mật khẩu</h2>
          <div>
            <label>Mã OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full input input-bordered"
              placeholder="Nhập mã OTP"
            />
          </div>
          <div>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full input input-bordered"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Đặt lại mật khẩu
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
