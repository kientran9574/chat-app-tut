import User from "../models/users.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../index.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    console.log("🚀 ~ getUsersForSidebar ~ loggedInUser:", loggedInUser);
    // tìm tất cả người dùng nhưng không tìm người dùng hiện tại đang đăng nhập
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    console.log("🚀 ~ getUsersForSidebar ~ filteredUsers:", filteredUsers);
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    //  filter ra được thì nó trả ra data giữa cuộc trò chuyện 2 người này
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const imageResponse = await cloudinary.uploader.upload(image);
      imageUrl = imageResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });
    await newMessage.save();
    // real-time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
  }
};
