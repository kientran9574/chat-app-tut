import cloudinary from "../lib/cloudinary.js";
import { generateToken, generationOTP } from "../lib/utils.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../lib/nodemailer.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tất cả các trường bắt buộc phải có" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password độ dài không được dưới 6 ký tự" });
    }
    // email đã tồn tại hay chưa
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      return res.status(400).json({ message: "Email này đã tồn tại" });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // đăng ký user
    const users = new User({
      fullName,
      password: hashPassword,
      email,
    });
    if (users) {
      generateToken(users.id, res);
      await users.save();
      const userResponse = await User.findById(users.id).select("-password"); // Loại bỏ password khi lấy user
      res.status(201).json({
        message: "Đăng ký user thành công",
        data: userResponse,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Tất cả các trường bắt buộc phải có" });
    }
    const users = await User.findOne({ email });
    if (!users) {
      return res.status(400).json({ message: "Thông tin không hợp lệ" });
    }
    const isMatchPassword = await bcrypt.compare(password, users.password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "password không hợp lệ" });
    }
    generateToken(users.id, res);
    // Chuyển object và xóa password trước khi trả về
    const userResponse = users.toObject();
    console.log("🚀 ~ login ~ userResponse:", userResponse);
    delete userResponse.password;
    return res.status(201).json({
      message: "Đăng nhập thành công",
      data: userResponse,
    });
  } catch (error) {}
};
export const logout = (req, res) => {
  try {
    res.cookies("jwt", "", { maxAge: 0 });
    return res.status(200).json({ messsage: "logout thành công" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("test server", req.body);
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email là bắt buộc" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Tạo mã OTP ngẫu nhiên (6 chữ số)
    const otp = generationOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

    // Lưu OTP và thời gian hết hạn vào user
    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    // Gửi email chứa OTP
    const subject = "Mã OTP để đặt lại mật khẩu";
    const text = `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`;
    await sendEmail(email, subject, text);

    res.status(200).json({ message: "Mã OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.log("Error in forgotPassword controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Tất cả các trường là bắt buộc" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Kiểm tra OTP
    if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu và xóa OTP
    user.password = hashPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.log("Error in resetPassword controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
