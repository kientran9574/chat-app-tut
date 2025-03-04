import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Áp dụng Singleton: Nếu model "User" đã tồn tại, sử dụng lại, nếu chưa thì tạo mới
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
