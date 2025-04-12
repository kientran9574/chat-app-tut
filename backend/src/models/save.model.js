import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);
// Đảm bảo mỗi user chỉ lưu 1 post 1 lần
saveSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Save = mongoose.models.Save || mongoose.model("Save", saveSchema);

export default Save;
