import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false, // Bắt buộc nếu là chat nhóm, không cần nếu là chat 1-1
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
// Áp dụng Singleton: Nếu model "Message" đã tồn tại, sử dụng lại, nếu chưa thì tạo mới
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
